<script setup lang="ts">
import type { Component } from 'vue'

/** Phone navigation: the same places, in the same order, as the desktop rail.
    One item may be `primary` (the centre "Add"). */
export interface PfNavItem { to: string, label: string, icon: Component, primary?: boolean, badge?: number }
defineProps<{ items: PfNavItem[], label?: string }>()
const route = useRoute()
const t = useT()
const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <nav class="pf-tabbar" :aria-label="label ?? t('nav.label', 'Main')">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="pf-tabbar__item"
      :class="{ 'is-active': isActive(item.to), 'is-primary': item.primary }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      <span class="pf-tabbar__icon">
        <component :is="item.icon" :size="22" aria-hidden="true" />
        <span v-if="item.badge" class="pf-tabbar__badge pf-num">{{ item.badge }}</span>
      </span>
      <span class="pf-tabbar__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.pf-tabbar {
  display: flex;
  align-items: stretch;
  background: var(--pf-paper);
  border-top: var(--pf-hair) solid var(--pf-line);
  padding-bottom: var(--pf-safe-b);
}
.pf-tabbar__item {
  flex: 1 1 0;
  min-width: 0;
  min-height: var(--pf-tabbar-h);
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--pf-0h);
  padding: var(--pf-1);
  color: var(--pf-ink-2);
  text-decoration: none;
  font-size: var(--pf-t-small);
  line-height: 1.15;
  font-weight: var(--pf-w-medium);
  text-align: center;
}
.pf-tabbar__label {
  max-width: 100%;
  overflow-wrap: anywhere;
}
.pf-tabbar__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--pf-10);
  height: var(--pf-8);
  border-radius: var(--pf-r-control);
}
.pf-tabbar__item.is-active {
  color: var(--pf-ink);
}
.pf-tabbar__item.is-active .pf-tabbar__icon {
  background: var(--pf-well);
}
.pf-tabbar__item.is-primary .pf-tabbar__icon {
  background: var(--pf-blue);
  color: var(--pf-on-blue);
}
.pf-tabbar__item:focus-visible {
  outline-offset: calc(var(--pf-focus) * -1);
}
.pf-tabbar__badge {
  position: absolute;
  top: calc(var(--pf-1) * -1);
  inset-inline-end: calc(var(--pf-1) * -1);
  min-width: var(--pf-4);
  padding: 0 var(--pf-1);
  border-radius: var(--pf-r-round);
  background: var(--pf-ink);
  color: var(--pf-on-ink);
  font-size: var(--pf-t-small);
  line-height: var(--pf-4);
}
</style>
