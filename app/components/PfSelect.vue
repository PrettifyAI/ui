<script setup lang="ts" generic="T extends string | number">
import { ChevronDown } from 'lucide-vue-next'

/** A native select, restyled: the system picker is the best one on a phone. */
defineProps<{
  label: string
  options: { value: T, label: string }[]
  hint?: string
  disabled?: boolean
  hideLabel?: boolean
}>()
const model = defineModel<T>({ required: true })
const id = useId()
</script>

<template>
  <div class="pf-select">
    <label :for="id" class="pf-label" :class="{ 'pf-sr': hideLabel }">{{ label }}</label>
    <div class="pf-select__box">
      <select :id="id" v-model="model" class="pf-select__input" :disabled="disabled">
        <option v-for="o in options" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
      </select>
      <ChevronDown :size="18" aria-hidden="true" class="pf-select__chev" />
    </div>
    <p v-if="hint" class="pf-small pf-quiet">{{ hint }}</p>
  </div>
</template>

<style scoped>
.pf-select {
  display: grid;
  gap: var(--pf-1);
}
.pf-select__box {
  position: relative;
  display: flex;
  align-items: center;
}
.pf-select__input {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-height: var(--pf-control-h);
  padding: var(--pf-2) var(--pf-10) var(--pf-2) var(--pf-3);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
  color: var(--pf-ink);
  font: inherit;
  cursor: pointer;
}
.pf-select__input:hover {
  border-color: var(--pf-ink);
}
.pf-select__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pf-select__chev {
  position: absolute;
  inset-inline-end: var(--pf-3);
  pointer-events: none;
  color: var(--pf-ink-2);
}
</style>
