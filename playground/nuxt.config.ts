import tailwindcss from '@tailwindcss/vite'

// The reference: every Pf* component in every state, on one browsable page.
// It consumes the layer exactly as an app does, so it doubles as the wiring test.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: ['..'],
  css: ['~/assets/main.css'],
  vite: { plugins: [tailwindcss()] },
  devtools: { enabled: false },
  app: { head: { title: 'Prettify design system', htmlAttrs: { lang: 'en' } } },
})
