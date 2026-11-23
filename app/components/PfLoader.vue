<script setup lang="ts">
/** The page loader: the mark developing, over the whole page. Shown while a
    page that cannot render yet is loading; it never blocks one that can. */
withDefaults(defineProps<{ label?: string }>(), { label: 'Loading' })
</script>

<template>
  <div class="pf-loader" role="status" aria-live="polite">
    <PfLogo size="xl" loop />
    <span class="pf-sr">{{ label }}</span>
  </div>
</template>

<style scoped>
.pf-loader {
  position: fixed;
  inset: 0;
  z-index: var(--pf-z-toast);
  display: grid;
  place-items: center;
  background: var(--pf-table);
}
</style>
