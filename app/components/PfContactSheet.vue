<script setup lang="ts" generic="T extends PfSheetItem">
/**
 * Prints laid out like a contact sheet: justified rows, every photo at its
 * true aspect ratio, square corners. No uniform tiles.
 *
 * Virtualised: rows are positioned from a computed layout and only those
 * near the viewport are in the DOM, so 2,000 items scroll like 20.
 * Before the width is known (server render, first frame) it falls back to a
 * pure-CSS flex layout of the first rows that approximates the same thing.
 */
export interface PfSheetItem {
  id: string
  src: string
  width: number
  height: number
  alt?: string
  /** A clip: plays muted on hover, shows its length. */
  video?: string
  seconds?: number
}
export interface PfSheetSection<I> { id: string, label?: string, items: I[] }

const props = withDefaults(defineProps<{
  items?: T[]
  sections?: PfSheetSection<T>[]
  rowHeight?: number
  rowHeightNarrow?: number
  gap?: number
  maxRows?: number
  selectable?: boolean
  selected?: string[]
  to?: (item: T) => string | undefined
}>(), { rowHeight: 232, rowHeightNarrow: 132, gap: 8, selected: () => [] })

const emit = defineEmits<{ 'open': [item: T], 'update:selected': [ids: string[]] }>()

const root = ref<HTMLElement>()
const width = ref(0)
const view = ref({ top: 0, bottom: 2000 })
const LABEL_H = 44
const NARROW = 640

const groups = computed<PfSheetSection<T>[]>(() => props.sections ?? [{ id: 'all', items: props.items ?? [] }])

type Row =
  | { kind: 'label', key: string, y: number, h: number, label: string }
  | { kind: 'row', key: string, y: number, h: number, cells: { item: T, x: number, w: number }[] }

const layout = computed(() => {
  const W = width.value
  if (!W) return null
  const target = W < NARROW ? props.rowHeightNarrow : props.rowHeight
  const rows: Row[] = []
  let y = 0
  let count = 0
  for (const g of groups.value) {
    if (g.label) {
      rows.push({ kind: 'label', key: `l-${g.id}`, y, h: LABEL_H, label: g.label })
      y += LABEL_H
    }
    let line: T[] = []
    let sum = 0
    const flush = (last: boolean) => {
      if (!line.length) return
      const gaps = props.gap * (line.length - 1)
      // A full row is scaled to fill the width. The last, short row keeps the
      // target height rather than being blown up to fill it.
      const natural = (W - gaps) / sum
      const h = last && natural > target * 1.25 ? target : natural
      let x = 0
      const cells = line.map((item) => {
        const w = (item.width / item.height) * h
        const cell = { item, x, w }
        x += w + props.gap
        return cell
      })
      rows.push({ kind: 'row', key: `r-${g.id}-${line[0]!.id}`, y, h, cells })
      y += h + props.gap
      count++
      line = []
      sum = 0
    }
    for (const item of g.items) {
      if (props.maxRows && count >= props.maxRows) break
      line.push(item)
      sum += item.width / item.height
      if (sum * target + props.gap * (line.length - 1) >= W) flush(false)
    }
    if (!props.maxRows || count < props.maxRows) flush(true)
    y += g.label ? props.gap * 2 : 0
  }
  return { rows, height: Math.max(0, y - props.gap) }
})

const visible = computed(() => {
  const l = layout.value
  if (!l) return []
  const pad = 600
  return l.rows.filter(r => r.y + r.h >= view.value.top - pad && r.y <= view.value.bottom + pad)
})

function measure() {
  const el = root.value
  if (!el) return
  width.value = el.clientWidth
  const r = el.getBoundingClientRect()
  view.value = { top: -r.top, bottom: -r.top + window.innerHeight }
}
let ro: ResizeObserver | undefined
let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => { ticking = false; measure() })
}
onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (root.value) ro.observe(root.value)
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('scroll', onScroll, { capture: true })
  window.removeEventListener('resize', onScroll)
})

function toggle(id: string, on: boolean) {
  const set = new Set(props.selected)
  if (on) set.add(id)
  else set.delete(id)
  emit('update:selected', [...set])
}
const fallback = computed(() => groups.value.flatMap(g => g.items).slice(0, 24))

/** Scroll offset of a section label, for a month scrubber. */
function offsetOf(sectionId: string): number | undefined {
  return layout.value?.rows.find(r => r.key === `l-${sectionId}`)?.y
}
defineExpose({ offsetOf, el: root })
</script>

<template>
  <div
    ref="root"
    class="pf-sheet-grid"
    :class="{ 'pf-sheet-grid--css': !layout }"
    :style="layout ? { height: `${layout.height}px` } : { '--h': `${rowHeightNarrow}px`, '--gap': `${gap}px` }"
  >
    <template v-if="layout">
      <template v-for="row in visible" :key="row.key">
        <p
          v-if="row.kind === 'label'"
          class="pf-sheet-grid__label pf-label pf-quiet"
          :style="{ transform: `translateY(${row.y}px)`, height: `${row.h}px` }"
        >
          {{ row.label }}
        </p>
        <div v-else class="pf-sheet-grid__row" :style="{ transform: `translateY(${row.y}px)`, height: `${row.h}px` }">
          <div
            v-for="cell in row.cells"
            :key="cell.item.id"
            class="pf-sheet-grid__cell"
            :style="{ left: `${cell.x}px`, width: `${cell.w}px`, height: `${row.h}px` }"
          >
            <slot name="item" :item="cell.item" :selected="selected.includes(cell.item.id)">
              <PfVideo
                v-if="cell.item.video"
                :src="cell.item.video"
                :poster="cell.item.src"
                :width="cell.item.width"
                :height="cell.item.height"
                :seconds="cell.item.seconds"
                :alt="cell.item.alt"
                edge="thin"
                hover-play
              />
              <div v-if="cell.item.video && $slots.actions" class="pf-sheet-grid__vactions"><slot name="actions" :item="cell.item" /></div>
              <PfPrint
                v-else
                :src="cell.item.src"
                :alt="cell.item.alt"
                :width="cell.item.width"
                :height="cell.item.height"
                edge="thin"
                :to="to?.(cell.item)"
                :selectable="selectable"
                :selected="selected.includes(cell.item.id)"
                @update:selected="toggle(cell.item.id, $event)"
                @open="emit('open', cell.item)"
              >
                <template v-if="$slots.overlay" #overlay><slot name="overlay" :item="cell.item" /></template>
                <template v-if="$slots.actions" #actions><slot name="actions" :item="cell.item" /></template>
              </PfPrint>
            </slot>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div
        v-for="item in fallback"
        :key="item.id"
        class="pf-sheet-grid__css-cell"
        :style="{ '--a': String(item.width / item.height) }"
      >
        <PfPrint :src="item.src" :alt="item.alt" :width="item.width" :height="item.height" edge="thin" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.pf-sheet-grid {
  position: relative;
  width: 100%;
}
.pf-sheet-grid__row,
.pf-sheet-grid__label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0;
}
.pf-sheet-grid__label {
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--pf-2);
  box-sizing: border-box;
}
.pf-sheet-grid__cell {
  position: absolute;
  top: 0;
}
/* The print fills its cell exactly: the layout already includes the edge. */
.pf-sheet-grid__cell :deep(.pf-print),
.pf-sheet-grid__cell :deep(.pf-video) {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
.pf-sheet-grid__cell :deep(.pf-print__stage) {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
}
.pf-sheet-grid__cell :deep(.pf-print__photo),
.pf-sheet-grid__cell :deep(.pf-video__frame) {
  aspect-ratio: auto !important;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.pf-sheet-grid__vactions {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
}
.pf-sheet-grid--css {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  max-height: calc(var(--h) * 3 + var(--gap) * 2);
  overflow: hidden;
}
.pf-sheet-grid__css-cell {
  flex: var(--a) 1 calc(var(--a) * var(--h));
  min-width: 0;
}
</style>
