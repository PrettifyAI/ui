<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

/** Like. Liked is an ink-filled heart: the photo stays the only colour. */
defineProps<{ count?: number }>()
const liked = defineModel<boolean>('liked', { default: false })
const t = useT()
</script>

<template>
  <button
    type="button"
    class="pf-like"
    :class="{ 'is-liked': liked }"
    :aria-pressed="liked"
    :aria-label="liked ? t('like.unlike', 'Remove like') : t('like.like', 'Like')"
    @click="liked = !liked"
  >
    <Heart :size="22" aria-hidden="true" />
    <span v-if="count !== undefined" class="pf-label pf-num">{{ count }}</span>
  </button>
</template>

<style scoped>
.pf-like {
  display: inline-flex;
  align-items: center;
  gap: var(--pf-1);
  min-width: var(--pf-tap);
  min-height: var(--pf-tap);
  padding: 0 var(--pf-2);
  border: 0;
  border-radius: var(--pf-r-control);
  background: transparent;
  color: var(--pf-ink);
  font: inherit;
  cursor: pointer;
}
.pf-like:hover {
  background: var(--pf-well);
}
.pf-like.is-liked :deep(svg) {
  fill: var(--pf-ink);
}
.pf-like:active :deep(svg) {
  transform: scale(0.88);
}
.pf-like :deep(svg) {
  transition: transform var(--pf-d-press) var(--pf-ease);
}
</style>
