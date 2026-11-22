<script setup lang="ts">
/** What is left this period, in things people count, and when it resets. */
const props = defineProps<{ label: string, used: number, limit: number, unit?: string, resets?: string }>()
const t = useT()
const pct = computed(() => Math.min(100, props.limit ? (props.used / props.limit) * 100 : 0))
const left = computed(() => Math.max(0, props.limit - props.used))
</script>

<template>
  <div class="pf-meter" :class="{ 'is-out': left === 0 }">
    <div class="pf-meter__head">
      <span class="pf-label">{{ label }}</span>
      <span class="pf-small pf-num">
        {{ t('meter.left', '{left} of {limit} left', { left, limit }) }}<template v-if="unit"> {{ unit }}</template>
      </span>
    </div>
    <div
      class="pf-meter__track"
      role="meter"
      :aria-label="label"
      aria-valuemin="0"
      :aria-valuemax="limit"
      :aria-valuenow="used"
    >
      <span class="pf-meter__fill" :style="{ width: `${pct}%` }" />
    </div>
    <p v-if="resets" class="pf-small pf-quiet">{{ resets }}</p>
  </div>
</template>

<style scoped>
.pf-meter {
  display: grid;
  gap: var(--pf-1);
}
.pf-meter__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--pf-1) var(--pf-3);
}
.pf-meter__track {
  height: var(--pf-2);
  background: var(--pf-well);
  box-shadow: inset 0 0 0 var(--pf-hair) var(--pf-line);
  border-radius: var(--pf-r-round);
  overflow: hidden;
}
.pf-meter__fill {
  display: block;
  height: 100%;
  background: var(--pf-ink);
}
.pf-meter p {
  margin: 0;
}
.is-out .pf-meter__head span:last-child {
  font-weight: var(--pf-w-strong);
}
</style>
