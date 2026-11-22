<script setup lang="ts">
/** Follow / Following. The verb names what pressing does; the state after it
    is named by the same word. */
defineProps<{ loading?: boolean, size?: 'm' | 's' }>()
const following = defineModel<boolean>('following', { default: false })
const t = useT()
</script>

<template>
  <PfButton
    :variant="following ? 'quiet' : 'primary'"
    :size="size ?? 's'"
    :loading="loading"
    :aria-pressed="following"
    @click="following = !following"
  >
    {{ following ? t('follow.following', 'Following') : t('follow.follow', 'Follow') }}
  </PfButton>
</template>
