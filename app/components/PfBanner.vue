<script setup lang="ts">
import { CircleAlert, Info, WifiOff, X } from 'lucide-vue-next'

/** A standing notice for the whole screen: a limit reached, no connection.
    Says what happened and what to do; the action is a slot. */
const props = withDefaults(defineProps<{
  tone?: 'info' | 'offline' | 'danger'
  title: string
  text?: string
  dismissible?: boolean
}>(), { tone: 'info' })
defineEmits<{ dismiss: [] }>()
const t = useT()
const icon = computed(() => ({ info: Info, offline: WifiOff, danger: CircleAlert })[props.tone])
</script>

<template>
  <div class="pf-banner" :class="`pf-banner--${tone}`" :role="tone === 'danger' ? 'alert' : 'status'">
    <component :is="icon" :size="20" class="pf-banner__icon" aria-hidden="true" />
    <div class="pf-banner__text">
      <p class="pf-label">{{ title }}</p>
      <p v-if="text" class="pf-small pf-quiet">{{ text }}</p>
    </div>
    <div v-if="$slots.default" class="pf-banner__action"><slot /></div>
    <PfIconButton v-if="dismissible" :label="t('banner.dismiss', 'Dismiss')" @click="$emit('dismiss')">
      <X :size="18" />
    </PfIconButton>
  </div>
</template>

<style scoped>
.pf-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pf-2) var(--pf-3);
  padding: var(--pf-3) var(--pf-4);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-inline-start: var(--pf-1) solid var(--pf-ink);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
}
.pf-banner--danger {
  border-inline-start-color: var(--pf-danger);
}
.pf-banner--danger .pf-banner__icon {
  color: var(--pf-danger);
}
.pf-banner__text {
  flex: 1 1 16rem;
  min-width: 0;
  display: grid;
  gap: var(--pf-0h);
}
.pf-banner__text p {
  margin: 0;
}
.pf-banner__action {
  display: flex;
  gap: var(--pf-2);
}
</style>
