# @prettify/ui

The Prettify design system as a Nuxt 4 layer: the tokens, the Commissioner type
scale and the `Pf*` components. The web app (`../web`) extends it; later the
admin can too.

Direction, from `design/prompts/00-foundation.md`: **a daylight photo studio,
not a neon AI dashboard.** Surfaces are true neutral grey so they never tint
the photo; the before/after **seam** (a 2 px line of warm light) is the brand;
photos are **prints** at their true aspect with square corners.

## Run it

```bash
pnpm install
pnpm dev          # the reference page on http://localhost:3000 (every component, every state)
pnpm build        # builds the reference app (the wiring test)
pnpm typecheck
pnpm test         # contrast ratios for both themes, read from tokens.css
pnpm check:literals   # fails on a colour literal in a component
```

Node 22.21+ or 24.11+ (Nuxt prints a warning on other versions; it still runs).

## What is here

| Path | What |
|---|---|
| `app/assets/css/tokens.css` | Every colour, size and radius. Two themes: day (default) and darkroom (`data-pf-theme="darkroom"` on any element) |
| `app/assets/css/fonts.css` | Commissioner variable (wght, slnt, **FLAR**, VOLM), self-hosted from `public/fonts`, six subsets incl. Cyrillic and Greek |
| `app/assets/css/theme.css` | Tailwind 4 bridge: tokens as utilities (`bg-table`, `text-ink-2`, `rounded-control`) |
| `app/assets/css/pf.css` | Base layer: type steps (`pf-display-xl` … `pf-small`), focus ring, shared classes |
| `app/components/Pf*.vue` | 37 components |
| `app/composables` | `useT` (translate), `usePfToast`, `usePfOverlay` (focus trap, Escape, scroll lock) |
| `app/utils` | `formatMessage` (ICU-lite: plural, selectordinal), `developLine` (the honest waiting line), `roughDuration` |
| `playground/` | The reference page; consumes the layer exactly as an app does |
| `test/contrast.test.mjs` | WCAG ratios for every text/background pair, both themes |

## Using the layer in an app

```ts
// nuxt.config.ts
import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
const uiLayer = realpathSync(resolve(__dirname, 'node_modules/@prettify/ui'))
export default defineNuxtConfig({ extends: [uiLayer], alias: { '#pfui': `${uiLayer}/app` } })
```

```css
/* the app's single CSS entry */
@import 'tailwindcss';
@import '@prettify/ui/app/assets/css/fonts.css';
@import '@prettify/ui/app/assets/css/tokens.css';
@import '@prettify/ui/app/assets/css/theme.css';
@import '@prettify/ui/app/assets/css/pf.css';
@source '../../../node_modules/@prettify/ui/app';
```

The layer has no `css:` entry on purpose (a layer that loads its own sheet gets
a second Tailwind instance). Mount `<PfToast />` once in `app.vue`.

**Pinning.** The app currently depends on `link:../ui`. Once the GitHub repo
exists the dependency becomes `github:PrettifyAI/ui#v0.1.0` (the `@gymmer/ui`
pattern); the tag `v0.1.0` is already on this commit locally.

## Rules the components keep

- **Tokens only.** No colour literal in a `.vue` file (`pnpm check:literals`).
  Sizes and radii come from tokens too; the one literal left is the `900px`
  breakpoint, because custom properties cannot be used in a media query.
- **Strings** are `t('key', 'English default')` through `useT()`. Without an
  app-provided `$t` the English default is used, so nothing renders a bare key.
  Never write a plural's closing `}}` inside a template mustache; build the
  string in `<script>`.
- **Blue is the action, ink is the selection, yellow is the seam.** A selected
  chip or segment is ink; only the next action is blue; nothing but the seam
  and generation progress is yellow.
- **Photos are never cropped into tiles.** `PfPrint`, `PfCompare`, `PfVideo`
  and `PfDevelop` take `width` and `height` and keep the aspect.
- **No percentage while a result is made.** `PfDevelop` and `developLine` show
  queue position and estimated start, then estimated time left, then "Almost
  there". Under `prefers-reduced-motion` the sweep is a static line.
- **44 px targets, visible blue focus, keyboard everywhere.** `PfCompare` is a
  slider (arrows 2%, Shift+arrows 10%, Home/End, hold Space for the original).

See `NOTES.md` for the decisions, the component list with props, and open
questions.
