// WCAG contrast for every text/background pair the system uses, in both
// themes, read straight from tokens.css. `pnpm test` prints the ratios.
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const css = readFileSync(new URL('../app/assets/css/tokens.css', import.meta.url), 'utf8')
function theme(selector) {
  const start = css.indexOf(selector)
  const block = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  return Object.fromEntries([...block.matchAll(/(--pf-[\w-]+):\s*(#[0-9a-f]{6})/gi)].map(m => [m[1], m[2]]))
}
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum]
const TEXT = 4.5
const NONTEXT = 3
const pairs = [
  ['--pf-ink', '--pf-table', TEXT], ['--pf-ink', '--pf-paper', TEXT], ['--pf-ink', '--pf-well', TEXT],
  ['--pf-ink-2', '--pf-table', TEXT], ['--pf-ink-2', '--pf-paper', TEXT], ['--pf-ink-2', '--pf-well', TEXT],
  ['--pf-blue', '--pf-table', TEXT], ['--pf-blue', '--pf-paper', TEXT],
  ['--pf-on-blue', '--pf-blue', TEXT], ['--pf-on-blue', '--pf-blue-deep', TEXT],
  ['--pf-danger', '--pf-table', TEXT], ['--pf-danger', '--pf-paper', TEXT],
  ['--pf-on-danger', '--pf-danger', TEXT],
  ['--pf-on-ink', '--pf-ink', TEXT],
  ['--pf-on-seam', '--pf-seam', TEXT],
  ['--pf-line-strong', '--pf-table', NONTEXT], ['--pf-line-strong', '--pf-paper', NONTEXT],
  ['--pf-blue', '--pf-well', NONTEXT],
]

for (const [name, selector] of [['day', ":root,\n[data-pf-theme='day']"], ['darkroom', "[data-pf-theme='darkroom']"]]) {
  const tk = theme(selector)
  test(`${name}: every pair meets its minimum`, () => {
    for (const [fg, bg, min] of pairs) {
      const r = ratio(tk[fg], tk[bg])
      console.log(`  ${name.padEnd(8)} ${fg.padEnd(18)} on ${bg.padEnd(16)} ${r.toFixed(2)}:1  (min ${min})`)
      assert.ok(r >= min, `${name}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`)
    }
  })
  test(`${name}: surfaces near a photo are true neutrals`, () => {
    for (const k of ['--pf-table', '--pf-paper', '--pf-well', '--pf-ink', '--pf-ink-2', '--pf-line', '--pf-line-strong']) {
      const h = tk[k]
      assert.ok(h.slice(1, 3) === h.slice(3, 5) && h.slice(3, 5) === h.slice(5, 7), `${name}: ${k} ${h} is tinted`)
    }
  })
}
