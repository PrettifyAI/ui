<script setup lang="ts">
/** A strength slider: a native range input (keyboard, touch and screen
    readers for free) drawn in ink. Ends are named in words, not numbers. */
const props = withDefaults(defineProps<{
  label: string
  min?: number
  max?: number
  step?: number
  startLabel?: string
  endLabel?: string
  valueText?: string
  disabled?: boolean
}>(), { min: 0, max: 100, step: 1 })
const model = defineModel<number>({ default: 50 })
const id = useId()
const fill = computed(() => `${((model.value - props.min) / (props.max - props.min)) * 100}%`)
</script>

<template>
  <div class="pf-slider" :class="{ 'is-disabled': disabled }">
    <div class="pf-slider__head">
      <label :for="id" class="pf-label">{{ label }}</label>
      <output v-if="valueText" :for="id" class="pf-small pf-num pf-quiet">{{ valueText }}</output>
    </div>
    <input
      :id="id"
      v-model.number="model"
      class="pf-slider__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-valuetext="valueText"
      :style="{ '--fill': fill }"
    >
    <div v-if="startLabel || endLabel" class="pf-slider__ends pf-small pf-quiet" aria-hidden="true">
      <span>{{ startLabel }}</span><span>{{ endLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.pf-slider {
  display: grid;
  gap: var(--pf-1);
}
.pf-slider__head,
.pf-slider__ends {
  display: flex;
  justify-content: space-between;
  gap: var(--pf-3);
}
.pf-slider__input {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: var(--pf-tap);
  margin: 0;
  background: transparent;
  cursor: pointer;
  border-radius: var(--pf-r-control);
}
.pf-slider__input::-webkit-slider-runnable-track {
  height: var(--pf-1);
  border-radius: var(--pf-r-round);
  background: linear-gradient(to right, var(--pf-ink) var(--fill), var(--pf-line-strong) var(--fill));
}
.pf-slider__input::-moz-range-track {
  height: var(--pf-1);
  border-radius: var(--pf-r-round);
  background: linear-gradient(to right, var(--pf-ink) var(--fill), var(--pf-line-strong) var(--fill));
}
.pf-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--pf-6);
  height: var(--pf-6);
  margin-top: calc((var(--pf-1) - var(--pf-6)) / 2);
  border-radius: var(--pf-r-round);
  border: var(--pf-0h) solid var(--pf-ink);
  background: var(--pf-paper);
}
.pf-slider__input::-moz-range-thumb {
  width: var(--pf-5);
  height: var(--pf-5);
  border-radius: var(--pf-r-round);
  border: var(--pf-0h) solid var(--pf-ink);
  background: var(--pf-paper);
}
.pf-slider__input:active::-webkit-slider-thumb {
  background: var(--pf-ink);
}
.is-disabled {
  opacity: 0.45;
}
</style>
