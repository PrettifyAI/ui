<script setup lang="ts">
/** An empty screen is an invitation: one sentence and one action. */
defineProps<{ title: string, text?: string }>()
</script>

<template>
  <div class="pf-empty">
    <div v-if="$slots.picture" class="pf-empty__picture"><slot name="picture" /></div>
    <h2 class="pf-display-m">{{ title }}</h2>
    <p v-if="text" class="pf-body pf-quiet">{{ text }}</p>
    <div v-if="$slots.default" class="pf-empty__action"><slot /></div>
  </div>
</template>

<style scoped>
.pf-empty {
  display: grid;
  justify-items: center;
  gap: var(--pf-2);
  padding: var(--pf-12) var(--pf-4);
  text-align: center;
}
.pf-empty p {
  margin: 0;
  max-width: 44ch;
}
.pf-empty__picture {
  margin-bottom: var(--pf-4);
}
.pf-empty__action {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--pf-2);
  margin-top: var(--pf-4);
}
</style>
