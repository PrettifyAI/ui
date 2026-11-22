<script setup lang="ts">
import { Play, Volume2, VolumeX } from 'lucide-vue-next'

/**
 * A clip, shown as a print. Poster first; plays on tap (or on hover with
 * `hoverPlay`, or when `active`); loops; muted by default.
 * Under reduced motion nothing plays until the person asks.
 */
const props = withDefaults(defineProps<{
  src: string
  poster: string
  width: number
  height: number
  seconds?: number
  alt?: string
  hoverPlay?: boolean
  active?: boolean
  controls?: boolean
  edge?: 'paper' | 'thin' | 'none'
}>(), { edge: 'paper' })

const t = useT()
const el = ref<HTMLVideoElement>()
const playing = ref(false)
const muted = ref(true)
const progress = ref(0)

function reduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
async function play() {
  try { await el.value?.play(); playing.value = true }
  catch { playing.value = false }
}
function pause() { el.value?.pause(); playing.value = false }
function toggle() { playing.value ? pause() : play() }
function onTime() {
  const v = el.value
  if (v && v.duration) progress.value = (v.currentTime / v.duration) * 100
}
function scrub(e: Event) {
  const v = el.value
  if (v && v.duration) v.currentTime = (Number((e.target as HTMLInputElement).value) / 100) * v.duration
}
watch(() => props.active, (a) => { if (a && !reduced()) play(); else if (a === false) pause() }, { immediate: false })
onMounted(() => { if (props.active && !reduced()) play() })
const length = computed(() => (props.seconds ? `0:${String(Math.round(props.seconds)).padStart(2, '0')}` : ''))
</script>

<template>
  <figure
    class="pf-video"
    :class="`pf-video--${edge}`"
    @pointerenter="hoverPlay && $event.pointerType === 'mouse' && !reduced() && play()"
    @pointerleave="hoverPlay && $event.pointerType === 'mouse' && pause()"
  >
    <div class="pf-video__frame" :style="{ aspectRatio: `${width} / ${height}` }">
      <video
        ref="el"
        :src="src"
        :poster="poster"
        :muted="muted"
        :aria-label="alt"
        loop
        playsinline
        preload="none"
        @timeupdate="onTime"
        @click="toggle"
      />
      <button
        v-if="!playing"
        type="button"
        class="pf-video__play"
        :aria-label="t('video.play', 'Play video')"
        @click="toggle"
      >
        <Play :size="22" aria-hidden="true" />
      </button>
      <span v-if="length && !controls" class="pf-photo-chip pf-video__len">{{ length }}</span>
    </div>
    <div v-if="controls" class="pf-video__bar">
      <PfIconButton :label="playing ? t('video.pause', 'Pause video') : t('video.play', 'Play video')" @click="toggle">
        <Play v-if="!playing" :size="20" /><span v-else class="pf-video__pause" aria-hidden="true"><i /><i /></span>
      </PfIconButton>
      <input
        class="pf-video__scrub"
        type="range"
        min="0"
        max="100"
        step="0.1"
        :value="progress"
        :aria-label="t('video.scrub', 'Position in the clip')"
        :style="{ '--fill': `${progress}%` }"
        @input="scrub"
      >
      <span v-if="length" class="pf-small pf-num pf-quiet">{{ length }}</span>
      <PfIconButton :label="muted ? t('video.unmute', 'Turn sound on') : t('video.mute', 'Turn sound off')" @click="muted = !muted">
        <VolumeX v-if="muted" :size="20" /><Volume2 v-else :size="20" />
      </PfIconButton>
    </div>
  </figure>
</template>

<style scoped>
.pf-video {
  margin: 0;
  background: var(--pf-paper);
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-line);
  min-width: 0;
}
.pf-video--paper { padding: var(--pf-edge); }
.pf-video--thin { padding: var(--pf-edge-thin); }
.pf-video--none { background: transparent; box-shadow: none; }
.pf-video__frame {
  position: relative;
  background: var(--pf-well);
  overflow: hidden;
}
.pf-video__frame video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
.pf-video__play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: var(--pf-12);
  height: var(--pf-12);
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--pf-r-control);
  background: var(--pf-photo-chip);
  color: var(--pf-on-photo);
  cursor: pointer;
}
.pf-video__len {
  position: absolute;
  inset-inline-start: var(--pf-2);
  bottom: var(--pf-2);
  pointer-events: none;
}
.pf-video__bar {
  display: flex;
  align-items: center;
  gap: var(--pf-2);
  padding-top: var(--pf-1);
}
.pf-video__pause {
  display: flex;
  gap: var(--pf-1);
}
.pf-video__pause i {
  width: var(--pf-1);
  height: var(--pf-4);
  background: currentColor;
}
.pf-video__scrub {
  flex: 1;
  min-width: 0;
  appearance: none;
  -webkit-appearance: none;
  height: var(--pf-tap);
  background: transparent;
  cursor: pointer;
}
.pf-video__scrub::-webkit-slider-runnable-track {
  height: var(--pf-0h);
  background: linear-gradient(to right, var(--pf-ink) var(--fill), var(--pf-line-strong) var(--fill));
}
.pf-video__scrub::-moz-range-track {
  height: var(--pf-0h);
  background: linear-gradient(to right, var(--pf-ink) var(--fill), var(--pf-line-strong) var(--fill));
}
.pf-video__scrub::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--pf-3);
  height: var(--pf-3);
  margin-top: calc((var(--pf-0h) - var(--pf-3)) / 2);
  border-radius: var(--pf-r-round);
  background: var(--pf-ink);
}
.pf-video__scrub::-moz-range-thumb {
  width: var(--pf-3);
  height: var(--pf-3);
  border: 0;
  border-radius: var(--pf-r-round);
  background: var(--pf-ink);
}
</style>
