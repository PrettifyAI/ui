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
/* The action stays in reach while long options scroll behind it. The offsets
   cancel the scrolling parent's bottom padding (a sheet's body). */
.pf-panel__action {
  position: sticky;
  bottom: calc(var(--pf-5) * -1);
  display: grid;
  gap: var(--pf-2);
  margin-top: auto;
  margin-bottom: calc(var(--pf-5) * -1);
  padding: var(--pf-3) 0 var(--pf-5);
  background: var(--pf-paper);
}
</style>
