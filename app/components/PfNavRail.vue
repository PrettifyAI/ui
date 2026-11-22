<script setup lang="ts">
import type { PfNavItem } from './PfTabBar.vue'

/** Desktop navigation: a narrow rail, icon over word. */
defineProps<{ items: PfNavItem[], label?: string, home?: string }>()
const route = useRoute()
const t = useT()
const isActive = (to: string) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <nav class="pf-rail" :aria-label="label ?? t('nav.label', 'Main')">
    <NuxtLink :to="home ?? '/'" class="pf-rail__logo" :aria-label="t('nav.home', 'Prettify home')">
      <slot name="logo"><PfLogo size="s" /></slot>
    </NuxtLink>
    <div class="pf-rail__items">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="pf-rail__item"
        :class="{ 'is-active': isActive(item.to), 'is-primary': item.primary }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
      >
        <span class="pf-rail__icon">
          <component :is="item.icon" :size="22" aria-hidden="true" />
          <span v-if="item.badge" class="pf-rail__badge pf-num">{{ item.badge }}</span>
        </span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
    <div v-if="$slots.default" class="pf-rail__end"><slot /></div>
  </nav>
</template>

<style scoped>
.pf-rail {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--pf-4);
  width: var(--pf-rail-w);
  box-sizing: border-box;
  padding: var(--pf-4) var(--pf-1);
  background: var(--pf-paper);
  border-inline-end: var(--pf-hair) solid var(--pf-line);
  height: 100%;
}
.pf-rail__logo {
  display: grid;
  place-items: center;
  min-height: var(--pf-tap);
  text-decoration: none;
  border-radius: var(--pf-r-control);
}
.pf-rail__items {
  display: grid;
  gap: var(--pf-1);
}
.pf-rail__item {
  display: grid;
  justify-items: center;
  gap: var(--pf-0h);
  padding: var(--pf-2) var(--pf-0h);
  border-radius: var(--pf-r-control);
  color: var(--pf-ink-2);
  text-decoration: none;
  font-size: var(--pf-t-small);
  line-height: 1.2;
  font-weight: var(--pf-w-medium);
  text-align: center;
  overflow-wrap: anywhere;
  hyphens: auto;
}
.pf-rail__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--pf-12);
  height: var(--pf-8);
  border-radius: var(--pf-r-control);
}
.pf-rail__item:hover .pf-rail__icon {
  background: var(--pf-well);
}
.pf-rail__item.is-active {
  color: var(--pf-ink);
}
.pf-rail__item.is-active .pf-rail__icon {
  background: var(--pf-ink);
  color: var(--pf-on-ink);
}
.pf-rail__item.is-primary .pf-rail__icon {
  background: var(--pf-blue);
  color: var(--pf-on-blue);
}
.pf-rail__badge {
  position: absolute;
  top: calc(var(--pf-1) * -1);
  inset-inline-end: 0;
  min-width: var(--pf-4);
  padding: 0 var(--pf-1);
  border-radius: var(--pf-r-round);
  background: var(--pf-ink);
  color: var(--pf-on-ink);
  font-size: var(--pf-t-small);
  line-height: var(--pf-4);
  box-shadow: 0 0 0 var(--pf-0h) var(--pf-paper);
}
.pf-rail__end {
  margin-top: auto;
  display: grid;
  justify-items: center;
  gap: var(--pf-1);
}
</style>
