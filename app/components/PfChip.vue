<script setup lang="ts">
/** A selectable chip (style, aspect, example request). Selected is ink, not
    blue: blue is reserved for the action that follows the choice. */
withDefaults(defineProps<{
  selected?: boolean | undefined
  disabled?: boolean
}>(), { selected: undefined })
defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <button
    type="button"
    class="pf-chip"
    :class="{ 'is-selected': selected }"
    :aria-pressed="selected === undefined ? undefined : selected"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<style scoped>
.pf-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--pf-2);
  min-height: var(--pf-control-h-s);
  padding: var(--pf-1) var(--pf-3);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
  color: var(--pf-ink);
  font: inherit;
  font-size: var(--pf-t-label);
  line-height: var(--pf-lh-label);
  font-weight: var(--pf-w-medium);
  text-align: start;
  cursor: pointer;
  transition: background-color var(--pf-d-press) var(--pf-ease);
}
/* The visual chip is 36 px; the pointer target is padded out to 44. */
@media (pointer: coarse) {
  .pf-chip { min-height: var(--pf-tap); }
}
.pf-chip:hover:not(:disabled) {
  background: var(--pf-well);
}
.pf-chip.is-selected {
  background: var(--pf-ink);
  border-color: var(--pf-ink);
  color: var(--pf-on-ink);
}
.pf-chip:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
