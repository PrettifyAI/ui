<script setup lang="ts">
/** The mark: the word with the seam through it. Plain letters before the
 *  seam, the same letters flared after it: "developed".
 *
 *  `develop` plays the idea once: the word starts as a poor copy (soft and
 *  blocky), the seam travels across it and what it has passed is sharp, then
 *  the seam settles where it lives. `loop` repeats that for as long as it is
 *  shown (the page loader). With reduced motion neither moves. */
const props = withDefaults(defineProps<{ size?: 's' | 'm' | 'l' | 'xl', develop?: boolean, loop?: boolean }>(), { size: 'm' })

const root = ref<HTMLElement>()
const plain = ref<HTMLElement>()
const playing = ref(props.develop || props.loop)
/** Where the seam rests, as a share of the word's width. */
const home = ref(0.5)
const uid = useId()

function measure() {
  const w = root.value?.getBoundingClientRect().width
  const p = plain.value?.getBoundingClientRect().width
  if (w && p) home.value = p / w
}
onMounted(() => {
  measure()
  // The share changes when the webfont replaces the fallback.
  document.fonts?.ready.then(measure).catch(() => {})
})
function ended(e: AnimationEvent) {
  if (!props.loop && e.animationName.includes('pf-logo-sweep')) playing.value = false
}
</script>

<template>
  <span
    ref="root"
    class="pf-logo"
    :class="[`pf-logo--${size}`, { 'is-playing': playing, 'is-loop': loop }]"
    :style="{ '--pf-logo-home': `${home * 100}%` }"
    role="img"
    aria-label="Prettify"
  >
    <!-- the poor copy underneath: only while the seam is travelling -->
    <span v-if="playing" aria-hidden="true" class="pf-logo__word pf-logo__poor" :style="{ filter: `url(#${uid}) blur(0.035em)` }">
      <span>Pret</span><span class="pf-logo__gap" /><span>tify</span>
    </span>
    <span aria-hidden="true" class="pf-logo__word pf-logo__sharp">
      <span ref="plain" class="pf-logo__plain">Pret</span>
      <span class="pf-logo__seam" />
      <span class="pf-logo__flared">tify</span>
    </span>
    <span v-if="playing" aria-hidden="true" class="pf-logo__sweep" @animationend="ended" />
    <svg v-if="playing" class="pf-logo__defs" aria-hidden="true" width="0" height="0" focusable="false">
      <!-- blocks: sample one pixel per cell, then grow it to fill the cell -->
      <filter :id="uid" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feFlood x="1" y="1" width="1" height="1" />
        <feComposite width="3" height="3" />
        <feTile result="grid" />
        <feComposite in="SourceGraphic" in2="grid" operator="in" />
        <feMorphology operator="dilate" radius="1" />
      </filter>
    </svg>
  </span>
</template>

<style scoped>
.pf-logo {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-size: var(--pf-t-title);
  font-weight: var(--pf-w-strong);
  letter-spacing: var(--pf-track-display);
  line-height: 1;
  color: var(--pf-ink);
  white-space: nowrap;
}
.pf-logo--s { font-size: var(--pf-t-body); }
.pf-logo--l { font-size: var(--pf-t-display-m); }
.pf-logo--xl { font-size: var(--pf-t-display-l); }
.pf-logo__word { display: inline-flex; align-items: center; }
.pf-logo__plain { font-variation-settings: 'FLAR' 0, 'VOLM' 0; }
.pf-logo__flared { font-variation-settings: 'FLAR' 100, 'VOLM' 0; }
.pf-logo__seam,
.pf-logo__gap {
  width: var(--pf-seam-w);
  height: 1.7em;
  margin: -0.35em 0.02em -0.35em 0.03em;
}
.pf-logo__seam { background: var(--pf-seam); }
.pf-logo__defs { position: absolute; }

/* ── developing ─────────────────────────────────────────────────────────── */
.pf-logo__poor {
  position: absolute;
  inset: 0;
  color: var(--pf-ink-2);
  font-variation-settings: 'FLAR' 0, 'VOLM' 0;
}
.pf-logo__sweep {
  position: absolute;
  top: -0.35em;
  bottom: -0.35em;
  left: 0;
  width: var(--pf-seam-w);
  margin-left: calc(var(--pf-seam-w) / -2);
  background: var(--pf-seam);
}
.is-playing .pf-logo__seam { background: none; }
.is-playing .pf-logo__sharp { animation: pf-logo-reveal var(--pf-d-logo, 1500ms) var(--pf-ease-sweep) both; }
.is-playing .pf-logo__sweep { animation: pf-logo-sweep var(--pf-d-logo, 1500ms) var(--pf-ease-sweep) both; }
.is-playing .pf-logo__poor { animation: pf-logo-poor var(--pf-d-logo, 1500ms) var(--pf-ease-sweep) both; }
.is-loop .pf-logo__sharp,
.is-loop .pf-logo__sweep,
.is-loop .pf-logo__poor { animation-duration: 2200ms; animation-iteration-count: infinite; }

/* The seam crosses the word (0 → 62%), then walks back to where it lives. */
@keyframes pf-logo-sweep {
  0% { left: 0; }
  62% { left: 100%; }
  100% { left: calc(var(--pf-logo-home) + var(--pf-seam-w)); }
}
@keyframes pf-logo-reveal {
  0% { clip-path: inset(-1em 100% -1em 0); }
  62%, 100% { clip-path: inset(-1em 0 -1em 0); }
}
@keyframes pf-logo-poor {
  0% { clip-path: inset(-1em 0 -1em 0); }
  62%, 100% { clip-path: inset(-1em 0 -1em 100%); }
}

@media (prefers-reduced-motion: reduce) {
  .pf-logo__poor, .pf-logo__sweep { display: none; }
  .is-playing .pf-logo__sharp { animation: none; }
  .is-playing .pf-logo__seam { background: var(--pf-seam); }
}
</style>
