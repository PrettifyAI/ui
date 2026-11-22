// ICU-lite: `{name}` placeholders, `{n, plural, one {# photo} other {# photos}}`
// and `{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}`.
// Enough for interface copy; not a full MessageFormat.

type Params = Record<string, unknown>

function matchBrace(s: string, open: number): number {
  let depth = 0
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') depth++
    else if (s[i] === '}' && --depth === 0) return i
  }
  return -1
}

function options(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  let i = 0
  while (i < body.length) {
    const open = body.indexOf('{', i)
    if (open < 0) break
    const close = matchBrace(body, open)
    if (close < 0) break
    out[body.slice(i, open).trim()] = body.slice(open + 1, close)
    i = close + 1
  }
  return out
}

export function formatMessage(msg: string, params?: Params, localeTag = 'en'): string {
  if (!params || !msg.includes('{')) return msg
  let out = ''
  let i = 0
  while (i < msg.length) {
    const open = msg.indexOf('{', i)
    if (open < 0) { out += msg.slice(i); break }
    const close = matchBrace(msg, open)
    if (close < 0) { out += msg.slice(i); break }
    out += msg.slice(i, open)
    const inner = msg.slice(open + 1, close)
    const m = /^\s*(\w+)\s*,\s*(plural|selectordinal)\s*,([\s\S]*)$/.exec(inner)
    if (m) {
      const n = Number(params[m[1]!])
      const opts = options(m[3]!)
      let rule = 'other'
      try {
        rule = new Intl.PluralRules(localeTag, { type: m[2] === 'plural' ? 'cardinal' : 'ordinal' }).select(n)
      }
      catch { /* unknown tag: keep "other" */ }
      const chosen = opts[`=${n}`] ?? opts[rule] ?? opts.other ?? ''
      out += formatMessage(chosen.replace(/#/g, String(n)), params, localeTag)
    }
    else {
      const key = inner.trim()
      out += key in params ? String(params[key]) : `{${inner}}`
    }
    i = close + 1
  }
  return out
}
