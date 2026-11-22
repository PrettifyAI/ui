// @prettify/ui — the Prettify design system as a Nuxt 4 layer.
//
// Consumed via `extends`. The consumer owns the single `@import 'tailwindcss'`
// and imports this layer's stylesheets from its own CSS entry (see README), so
// there is deliberately NO `css:` entry here: a layer that loads its own
// stylesheet gets a second Tailwind instance in a layered build.
//
// The font is self-hosted from `public/fonts` (Commissioner variable, all four
// axes, six subsets). @nuxt/fonts is not used: it cannot request the custom
// FLAR axis the display steps depend on.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      meta: [{ name: 'color-scheme', content: 'light' }],
      link: [
        // The Latin file carries every headline in most of the 25 languages;
        // preloading it removes the flare "pop" on first paint.
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/commissioner-latin-full-normal.woff2', crossorigin: '' },
      ],
    },
  },
})
