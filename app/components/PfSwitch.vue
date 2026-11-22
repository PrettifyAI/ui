<script setup lang="ts">
/** On or off, effective immediately. The whole row is the target. */
defineProps<{ label: string, hint?: string, disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
const id = useId()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="pf-switch"
    :aria-checked="model"
    :aria-describedby="hint ? `${id}-h` : undefined"
    :disabled="disabled"
    @click="model = !model"
  >
    <span class="pf-switch__text">
      <span class="pf-label">{{ label }}</span>
      <span v-if="hint" :id="`${id}-h`" class="pf-small pf-quiet">{{ hint }}</span>
    </span>
    <span class="pf-switch__track" aria-hidden="true"><span class="pf-switch__knob" /></span>
  </button>
</template>

<style scoped>
.pf-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pf-4);
  width: 100%;
  min-height: var(--pf-tap);
  padding: var(--pf-1) 0;
  border: 0;
  border-radius: var(--pf-r-control);
  background: transparent;
  color: var(--pf-ink);
  font: inherit;
  text-align: start;
  cursor: pointer;
}
.pf-switch__text {
  display: grid;
  gap: var(--pf-0h);
}
.pf-switch__track {
  flex: none;
  width: var(--pf-12);
  height: calc(var(--pf-6) + var(--pf-1));
  padding: var(--pf-0h);
  box-sizing: border-box;
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-round);
  background: var(--pf-well);
  transition: background-color var(--pf-d-press) var(--pf-ease);
}
.pf-switch__knob {
  display: block;
  height: 100%;
  aspect-ratio: 1;
  border-radius: var(--pf-r-round);
  background: var(--pf-ink-2);
  transition: transform var(--pf-d-move) var(--pf-ease), background-color var(--pf-d-press) var(--pf-ease);
}
.pf-switch[aria-checked='true'] .pf-switch__track {
  background: var(--pf-ink);
  border-color: var(--pf-ink);
}
.pf-switch[aria-checked='true'] .pf-switch__knob {
  background: var(--pf-on-ink);
  transform: translateX(calc(var(--pf-12) - var(--pf-6) - var(--pf-1) - var(--pf-0h)));
}
.pf-switch:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
