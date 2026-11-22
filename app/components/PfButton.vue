<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'

/**
 * The action. `primary` is the one blue thing on a screen; `quiet` is every
 * other action; `destructive` deletes; `ghost` sits in toolbars.
 * Labels wrap rather than truncate: German and Finnish run a third longer.
 */
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'quiet' | 'destructive' | 'ghost'
  size?: 'm' | 's'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  to?: RouteLocationRaw
  href?: string
  type?: 'button' | 'submit'
}>(), { variant: 'quiet', size: 'm', type: 'button' })

const NuxtLink = resolveComponent('NuxtLink')
const tag = computed(() => (props.to ? NuxtLink : props.href ? 'a' : 'button'))
const off = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="tag"
    class="pf-btn"
    :class="[`pf-btn--${variant}`, `pf-btn--${size}`, { 'pf-btn--block': block, 'is-loading': loading }]"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? off : undefined"
    :aria-disabled="off || undefined"
    :aria-busy="loading || undefined"
  >
    <LoaderCircle v-if="loading" class="pf-btn__spin" :size="18" aria-hidden="true" />
    <slot v-else name="icon" />
    <span class="pf-btn__label"><slot /></span>
    <slot name="trailing" />
  </component>
</template>

<style scoped>
.pf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--pf-2);
  min-height: var(--pf-control-h);
  padding: var(--pf-2) var(--pf-5);
  border: var(--pf-hair) solid transparent;
  border-radius: var(--pf-r-control);
  font: inherit;
  font-size: var(--pf-t-body);
  font-weight: var(--pf-w-medium);
  line-height: var(--pf-lh-label);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color var(--pf-d-press) var(--pf-ease), transform var(--pf-d-press) var(--pf-ease);
}
.pf-btn--s {
  min-height: var(--pf-control-h-s);
  padding: var(--pf-1) var(--pf-3);
  font-size: var(--pf-t-label);
}
.pf-btn--block {
  display: flex;
  width: 100%;
}
.pf-btn:active:not([aria-disabled]) {
  transform: translateY(var(--pf-hair));
}

.pf-btn--primary {
  background: var(--pf-blue);
  color: var(--pf-on-blue);
}
.pf-btn--primary:hover:not([aria-disabled]),
.pf-btn--primary:active:not([aria-disabled]) {
  background: var(--pf-blue-deep);
}

.pf-btn--quiet {
  background: var(--pf-paper);
  color: var(--pf-ink);
  border-color: var(--pf-line-strong);
}
.pf-btn--quiet:hover:not([aria-disabled]),
.pf-btn--quiet:active:not([aria-disabled]) {
  background: var(--pf-well);
}

.pf-btn--ghost {
  background: transparent;
  color: var(--pf-ink);
}
.pf-btn--ghost:hover:not([aria-disabled]),
.pf-btn--ghost:active:not([aria-disabled]) {
  background: var(--pf-well);
}

.pf-btn--destructive {
  background: var(--pf-danger);
  color: var(--pf-on-danger);
}
.pf-btn--destructive:hover:not([aria-disabled]) {
  filter: brightness(0.92);
}

.pf-btn[aria-disabled] {
  cursor: not-allowed;
}
.pf-btn[aria-disabled]:not(.is-loading) {
  opacity: 0.45;
}

.pf-btn__spin {
  animation: pf-spin 0.9s linear infinite;
}
@keyframes pf-spin {
  to { transform: rotate(360deg); }
}
</style>
