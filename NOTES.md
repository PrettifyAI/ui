# Design system notes (prompt 01)

## Decisions, checked against the foundation

**Tokens.** The eight starting tokens are kept as given. Added, all true
neutrals unless noted:

| Token | Day | Darkroom | Why |
|---|---|---|---|
| `--pf-well` | `#e0e0e0` | `#303030` | pressed tone, and the placeholder a photo fades in from |
| `--pf-line-strong` | `#858585` | `#7a7a7a` | control outlines. `--pf-line` is 1.3:1 on paper, fine for a divider and not for the edge of an input (WCAG 1.4.11 wants 3:1) |
| `--pf-on-ink` | `#fafafa` | `#1c1c1c` | text on a selected (ink) control |
| `--pf-blue-deep` | `#1631b4` | `#9aacff` | hover/pressed of the action colour |
| `--pf-on-blue`, `--pf-on-danger`, `--pf-on-seam` | | | text on the three fills; in darkroom the fills are light, so their text is ink |
| `--pf-scrim`, `--pf-photo-chip`, `--pf-on-photo` | | | the overlay behind a sheet; the one label that sits on a photo brings its own ground |
| `--pf-lift` | | | the single elevation (sheets, dialogs, toasts) |

Contrast, from `pnpm test` (minimum 4.5 for text, 3 for control outlines):

| Pair | Day | Darkroom |
|---|---|---|
| ink on table / paper | 15.59 / 17.65 | 15.22 / 13.52 |
| ink-2 on table / paper / well | 5.49 / 6.21 / 4.91 | 7.00 / 6.22 / 5.42 |
| blue on table / paper | 6.26 / 7.09 | 6.07 / 5.39 |
| on-blue on blue | 7.40 | 6.56 |
| danger on table / paper | 4.86 / 5.50 | 6.69 / 5.94 |
| on-seam on seam | 11.91 | 11.91 |
| line-strong on table / paper | 3.12 / 3.54 | 3.97 / 3.53 |

**Type.** Commissioner only. Display steps set `font-variation-settings:
'FLAR'`; text steps leave it at 0.

| Step | Size | Line height | Weight | FLAR |
|---|---|---|---|---|
| display-xl | clamp 44–92 px | 0.98 | 560 | 100 |
| display-l | clamp 34–56 px | 1.04 | 560 | 100 |
| display-m | clamp 26–34 px | 1.14 | 560 | 70 |
| title | 20 px | 1.3 | 620 | 0 |
| body | 16 px | 1.5 | 400 | 0 |
| label | 14 px | 1.35 | 500 | 0 |
| small | 13 px | 1.4 | 400 | 0 |

Display headings use `text-wrap: balance`, `overflow-wrap: break-word` and
`hyphens: auto`, so a long German or Finnish compound breaks instead of
overflowing. The font is self-hosted from the fontsource "full" build because
`@nuxt/fonts` cannot request the custom FLAR axis.

**Space, shape, elevation.** 4 px base (`--pf-1` … `--pf-24`). Radii: controls
10, sheets 16, photos 0; `--pf-r-round` exists only for geometry (switch track,
avatar, slider thumb). One elevation.

**The seam.** `#ffc83d`, 2 px. (a) Compare divider with a 14 × 44 grip inside a
44 px target; under a zoomed canvas the line is divided by `--pf-zoom` so it
stays 2 px. (b) Progress: parked at the left edge while a job waits, sweeping
left and right (alternating, so it never reads as progress restarting) while it
is made; a static line along the bottom under reduced motion. (c) Logo:
"Pret" plain, the seam, "tify" flared.

**Replaced because it was the default choice.** Selected state as a blue tint
(what any app does) became ink, keeping blue for the single next action. A
spinner inside the photo while generating became the seam. Rounded photo cards
became prints with a paper edge. A heart that turns red became an ink-filled
heart, so the photo stays the only colour.

## Components

Actions: `PfButton` (primary, quiet, ghost, destructive; `size`, `block`,
`loading`, `disabled`, `to`/`href`; slots `icon`, `trailing`), `PfIconButton`
(`label` required; ghost, quiet, primary, on-photo; `pressed`), `PfChip`
(`selected`), `PfSegmented` (radio group, arrow keys).

Input: `PfField`, `PfTextarea` (grows to `maxRows`, counter), `PfSlider`
(native range, named ends), `PfSwitch`, `PfSelect` (native), `PfDropzone`
(drag, paste, pick; camera and library buttons on touch; emits `files` and
`reject` with `type`/`size`).

Photo: `PfPrint` (plain, selectable, overlay/actions slots), `PfCompare`
(`drag` grip/anywhere, `follow`, `hold`, `intro`, `labels`; slots `before`,
`after`), `PfContactSheet` (justified rows, sections with labels, virtualised,
`maxRows`, selection, `offsetOf` for a scrubber), `PfVideo` (poster, tap or
hover to play, loop, muted, optional controls with scrub).

Making: `PfToolTray`, `PfToolPanel` (sticky action), `PfDevelop`, `PfJobRow`,
`PfResultBar`, `PfStatus`.

Structure: `PfSheet` (modal: bottom sheet under 900 px, side panel above;
`docked`: in the page flow), `PfDialog`, `PfTabBar`, `PfNavRail`, `PfTopBar`,
`PfToast` + `usePfToast`, `PfEmpty`, `PfBanner`.

People: `PfAvatar`, `PfUserRow`, `PfLikeButton`, `PfComment`, `PfFollowButton`.

Money: `PfPlanCard`, `PfUsageMeter`, `PfPaywallSheet`.

Added beyond the prompt's list: `PfLogo`, `PfStatus`.

## Open questions

1. Hover, focus and pressed states exist on every control but the reference
   page cannot freeze them; it shows rest, disabled, loading and error side by
   side and the rest live.
2. `PfContactSheet` virtualises rows, so off-screen prints are not in the tab
   order. Acceptable for a 2,000-item library; a "skip to month" control covers
   long jumps. Worth a proper accessibility review before launch.
3. The darkroom theme is defined for every token but only the editor surround
   uses it. A full dark app is a product decision the foundation says no to.
4. Dynamic Type up to XXL (prompt 09) is untested.
