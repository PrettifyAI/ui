<script setup lang="ts">
import { Ban, Check, CircleAlert, Clock, ScanLine } from 'lucide-vue-next'

/**
 * The status language shared by every job: one icon, one word, one colour
 * rule. Only `failed` is coloured. Accepts the API's words too.
 */
export type PfStatusName = 'waiting' | 'making' | 'ready' | 'failed' | 'cancelled'
const props = defineProps<{
  status: PfStatusName | 'queued' | 'running' | 'succeeded'
  iconOnly?: boolean
}>()
const t = useT()
const name = computed<PfStatusName>(() =>
  ({ queued: 'waiting', running: 'making', succeeded: 'ready' } as Record<string, PfStatusName>)[props.status]
  ?? (props.status as PfStatusName))
const icon = computed(() => ({ waiting: Clock, making: ScanLine, ready: Check, failed: CircleAlert, cancelled: Ban })[name.value])
const word = computed(() => ({
  waiting: t('status.waiting', 'Waiting'),
  making: t('status.making', 'Making'),
  ready: t('status.ready', 'Ready'),
  failed: t('status.failed', 'Failed'),
  cancelled: t('status.cancelled', 'Cancelled'),
})[name.value])
</script>

<template>
  <span class="pf-status" :class="`pf-status--${name}`">
    <component :is="icon" :size="16" aria-hidden="true" />
    <span :class="{ 'pf-sr': iconOnly }">{{ word }}</span>
  </span>
</template>

<style scoped>
.pf-status {
  display: inline-flex;
  align-items: center;
  gap: var(--pf-1);
  font-size: var(--pf-t-small);
  line-height: var(--pf-lh-small);
  font-weight: var(--pf-w-medium);
  color: var(--pf-ink);
}
.pf-status--waiting,
.pf-status--cancelled {
  color: var(--pf-ink-2);
}
.pf-status--failed {
  color: var(--pf-danger);
}
</style>
