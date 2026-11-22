<script setup lang="ts" generic="T extends string | number">
/** One choice out of a few (All / Photos / Videos). A radio group: arrow keys
    move the choice, Tab leaves it. Segments wrap on narrow screens. */
const props = defineProps<{
  options: { value: T, label: string }[]
  label: string
}>()
const model = defineModel<T>({ required: true })
const root = ref<HTMLElement>()

function move(delta: number) {
  const i = props.options.findIndex(o => o.value === model.value)
  const next = props.options[(i + delta + props.options.length) % props.options.length]
  if (!next) return
  model.value = next.value
  nextTick(() => root.value?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus())
}
</script>

<template>
  <div
    ref="root"
    class="pf-seg"
    role="radiogroup"
    :aria-label="label"
    @keydown.right.prevent="move(1)"
    @keydown.down.prevent="move(1)"
    @keydown.left.prevent="move(-1)"
    @keydown.up.prevent="move(-1)"
  >
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      role="radio"
      class="pf-seg__opt"
      :aria-checked="o.value === model"
      :tabindex="o.value === model ? 0 : -1"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.pf-seg {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--pf-0h);
  padding: var(--pf-0h);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
  max-width: 100%;
}
.pf-seg__opt {
  flex: 1 1 auto;
  min-height: var(--pf-control-h-s);
  padding: var(--pf-1) var(--pf-3);
  border: 0;
  border-radius: calc(var(--pf-r-control) - var(--pf-0h));
  background: transparent;
  color: var(--pf-ink);
  font: inherit;
  font-size: var(--pf-t-label);
  font-weight: var(--pf-w-medium);
  cursor: pointer;
  white-space: nowrap;
}
@media (pointer: coarse) {
  .pf-seg__opt { min-height: calc(var(--pf-tap) - var(--pf-1)); }
}
.pf-seg__opt:hover {
  background: var(--pf-well);
}
.pf-seg__opt[aria-checked='true'] {
  background: var(--pf-ink);
  color: var(--pf-on-ink);
}
</style>
