<script setup lang="ts">
/** A person. A photo if there is one, otherwise their initials on the well. */
const props = withDefaults(defineProps<{ name: string, src?: string, size?: 's' | 'm' | 'l' }>(), { size: 'm' })
const initials = computed(() =>
  props.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toLocaleUpperCase()).join(''))
</script>

<template>
  <span class="pf-avatar" :class="`pf-avatar--${size}`" role="img" :aria-label="name">
    <img v-if="src" :src="src" alt="" loading="lazy">
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>

<style scoped>
.pf-avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--pf-avatar);
  height: var(--pf-avatar);
  border-radius: var(--pf-r-round);
  background: var(--pf-well);
  color: var(--pf-ink);
  font-size: var(--pf-t-small);
  font-weight: var(--pf-w-strong);
  overflow: hidden;
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-line);
}
.pf-avatar--s { width: var(--pf-avatar-s); height: var(--pf-avatar-s); font-size: 0.625rem; }
.pf-avatar--l { width: var(--pf-avatar-l); height: var(--pf-avatar-l); font-size: var(--pf-t-title); }
.pf-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
