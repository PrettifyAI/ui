<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'

/** The bar at the top of a screen: where you are, the way back, and at most a
    few actions on the right. */
defineProps<{ title?: string, back?: RouteLocationRaw, backLabel?: string, plain?: boolean }>()
const t = useT()
</script>

<template>
  <header class="pf-topbar" :class="{ 'pf-topbar--plain': plain }">
    <PfIconButton v-if="back" :to="back" :label="backLabel ?? t('topbar.back', 'Back')">
      <ArrowLeft :size="20" />
    </PfIconButton>
    <slot name="start" />
    <h1 v-if="title" class="pf-title pf-topbar__title">{{ title }}</h1>
    <div class="pf-topbar__mid"><slot /></div>
    <div v-if="$slots.actions" class="pf-topbar__actions"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.pf-topbar {
  display: flex;
  align-items: center;
  gap: var(--pf-2);
  min-height: var(--pf-topbar-h);
  padding: var(--pf-safe-t) var(--pf-3) 0;
  background: var(--pf-paper);
  border-bottom: var(--pf-hair) solid var(--pf-line);
}
.pf-topbar--plain {
  background: transparent;
  border-bottom-color: transparent;
}
.pf-topbar__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-inline: var(--pf-1);
}
.pf-topbar__mid {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--pf-2);
}
.pf-topbar__actions {
  display: flex;
  align-items: center;
  gap: var(--pf-1);
}
</style>
