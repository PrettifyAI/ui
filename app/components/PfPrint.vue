<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { RouteLocationRaw } from 'vue-router'

/**
 * A photo, shown as a print: its true aspect ratio, square corners, a thin
 * paper edge. Never cropped to a uniform tile.
 *
 * Variants: plain, selectable (a checkbox appears; `selected` draws an ink
 * frame), with status (`status` slot or prop, bottom-left).
 * While loading it is a neutral placeholder at the right aspect; the picture
 * fades in. No shimmer.
 */
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  width: number
  height: number
  edge?: 'paper' | 'thin' | 'none'
  to?: RouteLocationRaw
  selectable?: boolean
  selected?: boolean
  selectLabel?: string
  eager?: boolean
  fit?: 'cover' | 'contain'
}>(), { alt: '', edge: 'paper', fit: 'cover' })
const emit = defineEmits<{ 'update:selected': [v: boolean], 'open': [e: MouseEvent] }>()

const NuxtLink = resolveComponent('NuxtLink')
const loaded = ref(false)
const img = ref<HTMLImageElement>()
onMounted(() => { if (img.value?.complete) loaded.value = true })
watch(() => props.src, () => { loaded.value = !!img.value?.complete })
const t = useT()
</script>

<template>
  <figure class="pf-print" :class="[`pf-print--${edge}`, { 'is-selected': selected, 'is-selectable': selectable }]">
    <div class="pf-print__stage">
    <component
      :is="to ? NuxtLink : 'div'"
      class="pf-print__photo"
      :to="to"
      :style="{ aspectRatio: `${width} / ${height}` }"
      @click="emit('open', $event)"
    >
      <img
        ref="img"
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        draggable="false"
        :class="{ 'is-loaded': loaded }"
        :style="{ objectFit: fit }"
        @load="loaded = true"
      >
    </component>
    <label v-if="selectable" class="pf-print__check">
      <input
        type="checkbox"
        class="pf-sr"
        :checked="selected"
        :aria-label="selectLabel ?? t('print.select', 'Select photo')"
        @change="emit('update:selected', ($event.target as HTMLInputElement).checked)"
      >
      <span class="pf-print__box" aria-hidden="true"><Check v-if="selected" :size="16" /></span>
    </label>
    <div v-if="$slots.overlay" class="pf-print__overlay"><slot name="overlay" /></div>
    <div v-if="$slots.actions" class="pf-print__actions"><slot name="actions" /></div>
    </div>
    <figcaption v-if="$slots.default" class="pf-print__caption pf-small"><slot /></figcaption>
  </figure>
</template>

<style scoped>
.pf-print {
  margin: 0;
  background: var(--pf-paper);
  border-radius: var(--pf-r-photo);
  box-shadow: 0 0 0 var(--pf-hair) var(--pf-line);
  min-width: 0;
}
.pf-print--paper { padding: var(--pf-edge); }
.pf-print--thin { padding: var(--pf-edge-thin); }
.pf-print--none { box-shadow: none; background: transparent; }

.pf-print__stage {
  position: relative;
}
.pf-print__photo {
  display: block;
  width: 100%;
  background: var(--pf-well);
  overflow: hidden;
  border-radius: var(--pf-r-photo);
}
a.pf-print__photo:focus-visible {
  outline-offset: var(--pf-edge);
}
.pf-print__photo img {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity var(--pf-d-move) linear;
  user-select: none;
  -webkit-user-drag: none;
}
.pf-print__photo img.is-loaded {
  opacity: 1;
}

.pf-print.is-selected {
  box-shadow: 0 0 0 var(--pf-focus) var(--pf-ink);
}

.pf-print__check {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: var(--pf-tap);
  height: var(--pf-tap);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.pf-print__box {
  display: grid;
  place-items: center;
  width: var(--pf-6);
  height: var(--pf-6);
  border-radius: var(--pf-2);
  border: var(--pf-0h) solid var(--pf-on-photo);
  background: var(--pf-photo-chip);
  color: var(--pf-on-ink);
}
.is-selected .pf-print__box {
  background: var(--pf-ink);
  border-color: var(--pf-ink);
}
.pf-print__check input:focus-visible + .pf-print__box {
  outline: var(--pf-focus) solid var(--pf-blue);
  outline-offset: var(--pf-focus-gap);
}

.pf-print__overlay {
  position: absolute;
  inset-inline-start: var(--pf-2);
  bottom: var(--pf-2);
  display: flex;
  gap: var(--pf-1);
  pointer-events: none;
}
.pf-print__actions {
  position: absolute;
  inset-inline-end: 0;
  top: 0;
  display: flex;
  gap: var(--pf-1);
  opacity: 0;
  transition: opacity var(--pf-d-press) linear;
}
.pf-print:hover .pf-print__actions,
.pf-print:focus-within .pf-print__actions,
.pf-print.is-selected .pf-print__actions {
  opacity: 1;
}
@media (hover: none) {
  .pf-print__actions { opacity: 1; }
}
.pf-print__caption {
  padding: var(--pf-2) var(--pf-1) var(--pf-1);
  color: var(--pf-ink-2);
}
</style>
