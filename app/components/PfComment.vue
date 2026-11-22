<script setup lang="ts">
/** One comment. Replies go in the default slot, one level deep. */
defineProps<{ name: string, src?: string, when: string, text: string, likes?: number }>()
const liked = defineModel<boolean>('liked', { default: false })
defineEmits<{ reply: [], report: [] }>()
const t = useT()
</script>

<template>
  <article class="pf-comment">
    <PfAvatar :name="name" :src="src" />
    <div class="pf-comment__main">
      <p class="pf-comment__head">
        <span class="pf-label">{{ name }}</span>
        <span class="pf-small pf-quiet">{{ when }}</span>
      </p>
      <p class="pf-body pf-comment__text">{{ text }}</p>
      <div class="pf-comment__actions">
        <button type="button" class="pf-link pf-small" @click="$emit('reply')">{{ t('comment.reply', 'Reply') }}</button>
        <button type="button" class="pf-link pf-small" @click="$emit('report')">{{ t('comment.report', 'Report') }}</button>
      </div>
      <div v-if="$slots.default" class="pf-comment__replies"><slot /></div>
    </div>
    <PfLikeButton v-model:liked="liked" :count="likes" />
  </article>
</template>

<style scoped>
.pf-comment {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--pf-3);
}
.pf-comment__main {
  display: grid;
  gap: var(--pf-1);
}
.pf-comment p {
  margin: 0;
}
.pf-comment__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--pf-2);
}
.pf-comment__text {
  overflow-wrap: anywhere;
}
.pf-comment__actions {
  display: flex;
  gap: var(--pf-4);
}
.pf-comment__actions .pf-link {
  color: var(--pf-ink-2);
  min-height: var(--pf-6);
}
.pf-comment__replies {
  display: grid;
  gap: var(--pf-4);
  margin-top: var(--pf-3);
}
</style>
