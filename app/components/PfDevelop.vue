<script setup lang="ts">
/**
 * A result being made. The source photo with the seam sweeping across it and
 * one honest line underneath.
 *
 * The server gives a queue position and an estimated start while a job waits,
 * and an estimated duration while it runs. There is NO percentage, so none is
 * shown: waiting says "3rd in line, starts in about 40 s"; making counts the
 * estimate down and then says "Almost there" instead of going negative.
 *
 * Waiting: the seam rests at the left edge. Making: it sweeps. Under reduced
 * motion the sweep becomes a static line along the bottom of the photo.
 */
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width: number
  height: number
  status: 'queued' | 'running'
  /** 1 = next. */
  position?: number
  /** ISO time the server expects the job to start. */
  estStart?: string
  /** ISO time the job started running. */
  startedAt?: string
  /** Expected seconds of making, from /capabilities. */
  estSeconds?: number
  kind?: 'photo' | 'video'
  edge?: 'paper' | 'thin' | 'none'
  /** Only the picture: the caller shows the line itself (see `developLine`). */
  bare?: boolean
}>(), { kind: 'photo', edge: 'paper' })

const t = useT()
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { now.value = Date.now(); timer = setInterval(() => { now.value = Date.now() }, 1000) })
onBeforeUnmount(() => clearInterval(timer))

const line = computed(() => developLine(props, now.value, t))
</script>

<template>
  <div class="pf-develop" :class="[`pf-develop--${status}`, `pf-develop--${edge}`]">
    <div class="pf-develop__print">
      <div class="pf-develop__frame" :style="{ aspectRatio: `${width} / ${height}` }">
        <img :src="src" :alt="alt ?? ''" :width="width" :height="height" draggable="false">
        <span class="pf-develop__seam" aria-hidden="true" />
        <span class="pf-develop__still" aria-hidden="true" />
      </div>
    </div>
    <div v-if="!bare" class="pf-develop__foot">
      <p class="pf-develop__line pf-label pf-num" role="status" aria-live="polite">{{ line }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.pf-develop {
  display: grid;
  gap: var(--pf-3);
  min-width: 0;
}
.pf-develop__print {
  background: var(--pf-paper);
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-line);
}
.pf-develop--paper .pf-develop__print { padding: var(--pf-edge); }
.pf-develop--thin .pf-develop__print { padding: var(--pf-edge-thin); }
.pf-develop--none .pf-develop__print { background: transparent; box-shadow: none; }
.pf-develop__frame {
  position: relative;
  overflow: hidden;
  background: var(--pf-well);
}
.pf-develop__frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}
.pf-develop__seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--pf-seam-w);
  transform: scaleX(calc(1 / var(--pf-zoom, 1)));
  background: var(--pf-seam);
}
.pf-develop--running .pf-develop__seam {
  animation: pf-sweep var(--pf-d-sweep) var(--pf-ease-sweep) infinite alternate;
}
@keyframes pf-sweep {
  from { left: 0; }
  to { left: calc(100% - var(--pf-seam-w)); }
}
.pf-develop__still {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--pf-seam-w);
  background: var(--pf-seam);
}
.pf-develop__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--pf-2) var(--pf-4);
}
.pf-develop__line {
  margin: 0;
}
@media (prefers-reduced-motion: reduce) {
  .pf-develop--running .pf-develop__seam { display: none; }
  .pf-develop--running .pf-develop__still { display: block; }
}
</style>
