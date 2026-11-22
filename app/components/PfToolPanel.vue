<script setup lang="ts">
/** The options for one tool: a name, a sentence, the controls, and the action
    pinned at the bottom where a thumb reaches. */
defineProps<{ title: string, text?: string }>()
</script>

<template>
  <section class="pf-panel">
    <header class="pf-panel__head">
      <h2 class="pf-title">{{ title }}</h2>
      <p v-if="text" class="pf-body pf-quiet">{{ text }}</p>
    </header>
    <div v-if="$slots.default" class="pf-panel__body"><slot /></div>
    <footer v-if="$slots.action" class="pf-panel__action"><slot name="action" /></footer>
  </section>
</template>

<style scoped>
.pf-panel {
  display: flex;
  flex-direction: column;
  gap: var(--pf-4);
  min-height: 0;
}
.pf-panel__head {
  display: grid;
  gap: var(--pf-1);
}
.pf-panel__head p {
  margin: 0;
}
.pf-panel__body {
  display: grid;
  gap: var(--pf-4);
  align-content: start;
}
.pf-panel__action {
  display: grid;
  gap: var(--pf-2);
  margin-top: auto;
}
</style>
