// "Tokens only": no colour literal may appear in a component. Fails on a hex
// colour, rgb()/hsl(), or a named colour used as a value in app/components.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('../app/', import.meta.url).pathname
const bad = []
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(vue|ts)$/.test(e.name)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (/#[0-9a-f]{3,8}\b(?![\w-])/i.test(line.replace(/&#\d+;/g, '')) && !/\/\/|\/\*|\*\//.test(line) && /[:=(,]\s*['"]?#[0-9a-f]{3,8}\b/i.test(line)
          || /\b(rgb|rgba|hsl|hsla|oklch)\(/.test(line)) bad.push(`${p.replace(root, 'app/')}:${i + 1}: ${line.trim()}`)
      })
    }
  }
}
walk(root + 'components')
walk(root + 'composables')
if (bad.length) { console.error('Colour literals outside tokens.css:\n' + bad.join('\n')); process.exit(1) }
console.log('No colour literals in components.')
