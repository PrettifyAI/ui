<script setup lang="ts">
/**
 * Before / after, divided by the seam. The seam is the brand: a 2 px line of
 * warm light with a grip.
 *
 * Left of the seam is the original, right of it the result.
 *
 *  - Drag the grip (or, with `drag="anywhere"`, the picture) to move it.
 *  - Keyboard: the grip is a slider. Arrows move 2%, Shift+arrows and
 *    PageUp/PageDown 10%, Home/End jump to the ends.
 *  - Press and hold the picture (or hold Space on the grip) to see the whole
 *    original; release to return.
 *  - `follow` makes the seam follow a mouse without pressing (landing hero).
 *  - `intro` plays the one orchestrated sweep on mount, then settles.
 *
 * Under a zoomed parent set `--pf-zoom` so the line keeps its 2 px.
 */
const props = withDefaults(defineProps<{
  before: string
  after: string
  width: number
  height: number
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  drag?: 'grip' | 'anywhere'
  follow?: boolean
  hold?: boolean
  labels?: boolean
  intro?: boolean
  edge?: 'paper' | 'thin' | 'none'
  eager?: boolean
}>(), { drag: 'anywhere', hold: true, labels: true, edge: 'paper' })

const pos = defineModel<number>({ default: 50 })
const emit = defineEmits<{ holding: [v: boolean], tick: [at: 0 | 50 | 100] }>()
const t = useT()

const root = ref<HTMLElement>()
const dragging = ref(false)
const holding = ref(false)
const introRunning = ref(false)

const HOLD_MS = 280
const SLOP = 6
let holdTimer: ReturnType<typeof setTimeout> | undefined
let start: { x: number, y: number, id: number, onGrip: boolean } | null = null
let raf = 0

function set(v: number) {
  const next = Math.min(100, Math.max(0, v))
  const prev = pos.value
  pos.value = next
  // A soft tick for haptics on native when the seam crosses 0, 50, 100.
  for (const mark of [0, 50, 100] as const) {
    if ((prev < mark && next >= mark) || (prev > mark && next <= mark)) emit('tick', mark)
  }
}
function fromClientX(x: number) {
  const r = root.value?.getBoundingClientRect()
  if (!r || !r.width) return
  set(((x - r.left) / r.width) * 100)
}
function setHolding(v: boolean) {
  if (holding.value === v) return
  holding.value = v
  emit('holding', v)
}
function stopIntro() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  introRunning.value = false
}

function onDown(e: PointerEvent) {
  if (e.button !== 0) return
  stopIntro()
  const onGrip = !!(e.target as HTMLElement).closest('.pf-compare__seam')
  start = { x: e.clientX, y: e.clientY, id: e.pointerId, onGrip }
  if (onGrip) {
    dragging.value = true
    root.value?.setPointerCapture(e.pointerId)
    e.preventDefault()
    return
  }
  if (props.hold) holdTimer = setTimeout(() => { if (start && !dragging.value) setHolding(true) }, HOLD_MS)
}
function onMove(e: PointerEvent) {
  if (!start) {
    if (props.follow && e.pointerType === 'mouse' && !introRunning.value) fromClientX(e.clientX)
    return
  }
  if (e.pointerId !== start.id) return
  const dx = e.clientX - start.x
  const dy = e.clientY - start.y
  if (!dragging.value && !holding.value && (Math.abs(dx) > SLOP || Math.abs(dy) > SLOP)) {
    clearTimeout(holdTimer)
    // A mostly horizontal move drags the seam; a vertical one is a scroll.
    if (props.drag === 'anywhere' && Math.abs(dx) > Math.abs(dy)) {
      dragging.value = true
      root.value?.setPointerCapture(e.pointerId)
    }
    else { start = null; return }
  }
  if (dragging.value) fromClientX(e.clientX)
}
function onUp() {
  clearTimeout(holdTimer)
  start = null
  dragging.value = false
  setHolding(false)
}

function onKey(e: KeyboardEvent) {
  const big = e.shiftKey ? 10 : 2
  const map: Record<string, () => void> = {
    ArrowLeft: () => set(pos.value - big),
    ArrowDown: () => set(pos.value - big),
    ArrowRight: () => set(pos.value + big),
    ArrowUp: () => set(pos.value + big),
    PageDown: () => set(pos.value - 10),
    PageUp: () => set(pos.value + 10),
    Home: () => set(0),
    End: () => set(100),
  }
  if (e.key === ' ' || e.key === 'Enter') {
    if (props.hold) { e.preventDefault(); setHolding(true) }
    return
  }
  const fn = map[e.key]
  if (fn) { e.preventDefault(); stopIntro(); fn() }
}
function onKeyUp(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') setHolding(false)
}

// The landing page's single orchestrated motion: the seam enters from the
// left edge and settles. Skipped entirely under reduced motion.
function playIntro(target: number) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { pos.value = target; return }
  introRunning.value = true
  const t0 = performance.now()
  const dur = 1500
  pos.value = 0
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur)
    const eased = 1 - (1 - p) ** 4
    // Travels a little past the mark, then eases back onto it.
    const overshoot = Math.sin(p * Math.PI) * 9 * (1 - p)
    pos.value = Math.min(100, target * eased + overshoot)
    if (p < 1) raf = requestAnimationFrame(step)
    else { pos.value = target; stopIntro() }
  }
  raf = requestAnimationFrame(step)
}
onMounted(() => { if (props.intro) playIntro(pos.value) })
onBeforeUnmount(() => { stopIntro(); clearTimeout(holdTimer) })

const shown = computed(() => (holding.value ? 100 : pos.value))
const valueText = computed(() =>
  t('compare.value', '{n}% original, {m}% result', { n: Math.round(pos.value), m: 100 - Math.round(pos.value) }))
</script>

<template>
  <div
    class="pf-compare"
    :class="[`pf-compare--${edge}`, `pf-compare--drag-${drag}`, { 'is-dragging': dragging, 'is-holding': holding }]"
  >
    <div
      ref="root"
      class="pf-compare__frame"
      :style="{ aspectRatio: `${width} / ${height}`, '--pos': `${shown}%` }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @lostpointercapture="onUp"
      @contextmenu.prevent
    >
      <div class="pf-compare__layer">
        <slot name="after">
          <img :src="after" :alt="afterAlt ?? ''" :width="width" :height="height" draggable="false" :loading="eager ? 'eager' : 'lazy'" decoding="async">
        </slot>
      </div>
      <div class="pf-compare__layer pf-compare__layer--before">
        <slot name="before">
          <img :src="before" :alt="beforeAlt ?? ''" :width="width" :height="height" draggable="false" :loading="eager ? 'eager' : 'lazy'" decoding="async">
        </slot>
      </div>

      <template v-if="labels">
        <span class="pf-photo-chip pf-compare__tag pf-compare__tag--before" :class="{ 'is-away': shown < 22 }">
          {{ beforeLabel ?? t('compare.original', 'Original') }}
        </span>
        <span class="pf-photo-chip pf-compare__tag pf-compare__tag--after" :class="{ 'is-away': shown > 78 }">
          {{ afterLabel ?? t('compare.result', 'Result') }}
        </span>
      </template>

      <div
        class="pf-compare__seam"
        role="slider"
        tabindex="0"
        aria-orientation="horizontal"
        :aria-label="t('compare.slider', 'Compare original and result')"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(pos)"
        :aria-valuetext="valueText"
        @keydown="onKey"
        @keyup="onKeyUp"
        @blur="setHolding(false)"
      >
        <span class="pf-compare__line" />
        <span class="pf-compare__grip"><i /><i /></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pf-compare {
  background: var(--pf-paper);
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-line);
  border-radius: var(--pf-r-photo);
  min-width: 0;
}
.pf-compare--paper { padding: var(--pf-edge); }
.pf-compare--thin { padding: var(--pf-edge-thin); }
.pf-compare--none { background: transparent; box-shadow: none; }

.pf-compare__frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--pf-well);
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: pan-y pinch-zoom;
  cursor: ew-resize;
}
.pf-compare--drag-grip .pf-compare__frame {
  cursor: inherit;
  touch-action: inherit;
}
.pf-compare__layer {
  position: absolute;
  inset: 0;
}
.pf-compare__layer :deep(img),
.pf-compare__layer :deep(video) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
}
.pf-compare__layer--before {
  clip-path: inset(0 calc(100% - var(--pos)) 0 0);
}

.pf-compare__tag {
  position: absolute;
  bottom: var(--pf-3);
  transition: opacity var(--pf-d-press) linear;
  pointer-events: none;
}
.pf-compare__tag--before { left: var(--pf-3); }
.pf-compare__tag--after { right: var(--pf-3); }
.pf-compare__tag.is-away { opacity: 0; }
.is-holding .pf-compare__tag--after { opacity: 0; }
.is-holding .pf-compare__tag--before { opacity: 1; }

/* The seam: a 44 px-wide target around a 2 px line. */
.pf-compare__seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: var(--pf-tap);
  margin-left: calc(var(--pf-tap) / -2);
  display: grid;
  place-items: center;
  cursor: ew-resize;
  touch-action: none;
  outline: none;
}
.pf-compare__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: calc(var(--pf-seam-w) / var(--pf-zoom, 1));
  margin-left: calc(var(--pf-seam-w) / var(--pf-zoom, 1) / -2);
  background: var(--pf-seam);
}
.pf-compare__grip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--pf-0h);
  width: var(--pf-seam-grip-w);
  height: var(--pf-seam-grip-h);
  border-radius: var(--pf-r-control);
  background: var(--pf-seam);
  transform: scale(calc(1 / var(--pf-zoom, 1)));
  transition: transform var(--pf-d-press) var(--pf-ease);
}
.pf-compare__grip i {
  width: var(--pf-hair);
  height: var(--pf-3);
  background: var(--pf-on-seam);
  opacity: 0.7;
}
.pf-compare__seam:focus-visible .pf-compare__grip {
  outline: var(--pf-focus) solid var(--pf-blue);
  outline-offset: var(--pf-focus-gap);
}
.pf-compare__seam:focus-visible .pf-compare__line {
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-blue);
}
.is-dragging .pf-compare__grip {
  transform: scale(calc(1.12 / var(--pf-zoom, 1)));
}
.is-holding .pf-compare__seam {
  opacity: 0;
}
</style>
