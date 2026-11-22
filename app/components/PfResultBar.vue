<script setup lang="ts">
import { Check, Download, RotateCw, Send, SplitSquareHorizontal } from 'lucide-vue-next'

/** What can be done with a fresh result. The verb on the button names the
    outcome: "Keep" becomes "Kept". */
withDefaults(defineProps<{
  kept?: boolean
  comparing?: boolean
  busy?: boolean
  canCompare?: boolean
  canPost?: boolean
  postLabel?: string
}>(), { canCompare: true, canPost: true })
defineEmits<{ keep: [], retry: [], compare: [], post: [], download: [] }>()
const t = useT()
</script>

<template>
  <div class="pf-result" role="group" :aria-label="t('result.group', 'Result actions')">
    <PfButton :variant="kept ? 'ghost' : 'primary'" :disabled="kept || busy" @click="$emit('keep')">
      <template #icon><Check v-if="kept" :size="20" aria-hidden="true" /></template>
      {{ kept ? t('result.kept', 'Kept') : t('result.keep', 'Keep') }}
    </PfButton>
    <PfButton :loading="busy" @click="$emit('retry')">
      <template #icon><RotateCw :size="20" aria-hidden="true" /></template>
      {{ t('result.retry', 'Try again') }}
    </PfButton>
    <span class="pf-result__gap" />
    <PfButton v-if="canCompare" variant="ghost" :aria-pressed="comparing" :class="{ 'is-on': comparing }" @click="$emit('compare')">
      <template #icon><SplitSquareHorizontal :size="20" aria-hidden="true" /></template>
      {{ t('result.compare', 'Compare') }}
    </PfButton>
    <PfButton v-if="canPost" variant="ghost" @click="$emit('post')">
      <template #icon><Send :size="20" aria-hidden="true" /></template>
      {{ postLabel ?? t('result.post', 'Post') }}
    </PfButton>
    <PfButton variant="ghost" @click="$emit('download')">
      <template #icon><Download :size="20" aria-hidden="true" /></template>
      {{ t('result.download', 'Download') }}
    </PfButton>
  </div>
</template>

<style scoped>
.pf-result {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pf-2);
}
.pf-result__gap {
  flex: 1 1 var(--pf-2);
}
/* Compare is a toggle, not a second primary: on is a quiet well with a rule. */
.pf-result :deep(.is-on) {
  background: var(--pf-well);
  box-shadow: inset 0 calc(var(--pf-0h) * -1) 0 var(--pf-ink);
}
.pf-result :deep(.pf-btn--ghost[aria-disabled]) {
  opacity: 1;
  color: var(--pf-ink-2);
}
</style>
