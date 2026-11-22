<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** A control that is only an icon. `label` is required: it is its name. */
const props = withDefaults(defineProps<{
  label: string
  variant?: 'ghost' | 'quiet' | 'primary' | 'on-photo'
  pressed?: boolean | undefined
  disabled?: boolean
  to?: RouteLocationRaw
}>(), { variant: 'ghost', pressed: undefined })

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.to ? NuxtLink : 'button'))
</script>

<template>
  <component
    :is="tag"
    class="pf-ib"
    :class="[`pf-ib--${variant}`, { 'is-pressed': pressed }]"
    :to="to"
    :type="tag === 'button' ? 'button' : undefined"
    :aria-label="label"
    :title="label"
    :aria-pressed="pressed === undefined ? undefined : pressed"
    :disabled="tag === 'button' ? disabled : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.pf-ib {
  display: inline-grid;
  place-items: center;
  width: var(--pf-tap);
  height: var(--pf-tap);
  flex: none;
  border: var(--pf-hair) solid transparent;
  border-radius: var(--pf-r-control);
  background: transparent;
  color: var(--pf-ink);
  cursor: pointer;
  transition: background-color var(--pf-d-press) var(--pf-ease);
}
.pf-ib:hover:not(:disabled) {
  background: var(--pf-well);
}
.pf-ib--quiet {
  background: var(--pf-paper);
  border-color: var(--pf-line-strong);
}
.pf-ib--primary {
  background: var(--pf-blue);
  color: var(--pf-on-blue);
}
.pf-ib--primary:hover:not(:disabled) {
  background: var(--pf-blue-deep);
}
/* Over a photo: a small chip inside the full 44 px target. */
.pf-ib--on-photo,
.pf-ib--on-photo:hover:not(:disabled) {
  background: transparent;
  color: var(--pf-on-photo);
}
.pf-ib--on-photo :deep(svg) {
  box-sizing: content-box;
  padding: var(--pf-1);
  border-radius: var(--pf-2);
  background: var(--pf-photo-chip);
}
.pf-ib--on-photo:hover:not(:disabled) :deep(svg) {
  background: var(--pf-ink);
}
.pf-ib.is-pressed {
  background: var(--pf-ink);
  color: var(--pf-on-ink);
}
.pf-ib:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
