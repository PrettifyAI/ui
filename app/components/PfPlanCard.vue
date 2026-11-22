<script setup lang="ts">
import { Check } from 'lucide-vue-next'

/** A plan, stated as things people count ("10 photos a week"). */
defineProps<{
  name: string
  price: string
  period?: string
  features: string[]
  current?: boolean
  note?: string
}>()
const t = useT()
</script>

<template>
  <article class="pf-plan" :class="{ 'is-current': current }">
    <header class="pf-plan__head">
      <h3 class="pf-title">{{ name }}</h3>
      <span v-if="current" class="pf-small pf-plan__current">{{ t('plan.current', 'Your plan') }}</span>
    </header>
    <p class="pf-plan__price">
      <span class="pf-display-m pf-num">{{ price }}</span>
      <span v-if="period" class="pf-small pf-quiet">{{ period }}</span>
    </p>
    <ul class="pf-plan__list">
      <li v-for="f in features" :key="f" class="pf-body">
        <Check :size="18" aria-hidden="true" /><span>{{ f }}</span>
      </li>
    </ul>
    <p v-if="note" class="pf-small pf-quiet">{{ note }}</p>
    <div v-if="$slots.default" class="pf-plan__action"><slot /></div>
  </article>
</template>

<style scoped>
.pf-plan {
  display: flex;
  flex-direction: column;
  gap: var(--pf-3);
  padding: var(--pf-6);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-sheet);
  background: var(--pf-paper);
}
.pf-plan.is-current {
  border-color: var(--pf-ink);
  box-shadow: inset 0 0 0 var(--pf-hair) var(--pf-ink);
}
.pf-plan__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--pf-2);
}
.pf-plan__current {
  font-weight: var(--pf-w-strong);
}
.pf-plan__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--pf-2);
  margin: 0;
}
.pf-plan__list {
  display: grid;
  gap: var(--pf-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.pf-plan__list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--pf-2);
  align-items: start;
}
.pf-plan__list :deep(svg) {
  margin-top: 0.2em;
}
.pf-plan p {
  margin: 0;
}
.pf-plan__action {
  display: grid;
  margin-top: auto;
  padding-top: var(--pf-3);
}
</style>
