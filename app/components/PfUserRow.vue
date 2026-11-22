<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** A maker in a list: avatar, name, @name, and one action on the right. */
defineProps<{ name: string, handle?: string, src?: string, to?: RouteLocationRaw, note?: string, size?: 's' | 'm' }>()
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="pf-user">
    <component :is="to ? NuxtLink : 'div'" :to="to" class="pf-user__who">
      <PfAvatar :name="name" :src="src" :size="size ?? 'm'" />
      <span class="pf-user__text">
        <span class="pf-label">{{ name }}</span>
        <span v-if="handle || note" class="pf-small pf-quiet">{{ note ?? `@${handle}` }}</span>
      </span>
    </component>
    <slot />
  </div>
</template>

<style scoped>
.pf-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--pf-3);
  min-height: var(--pf-tap);
}
.pf-user__who {
  display: flex;
  align-items: center;
  gap: var(--pf-3);
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border-radius: var(--pf-r-control);
}
.pf-user__text {
  display: grid;
  min-width: 0;
}
.pf-user__text span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
