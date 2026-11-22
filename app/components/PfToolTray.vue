<script setup lang="ts">
import type { Component } from 'vue'

/**
 * The tool strip: the same strip, in the same order, on a phone and on a
 * desktop. It scrolls sideways when the labels (or Dynamic Type) outgrow it.
 * A tool that is not available is absent from `tools`, never greyed out.
 *
 * A toolbar of toggle buttons: arrow keys move between tools, Tab leaves.
 */
export interface PfTool { id: string, label: string, icon: Component }
const props = defineProps<{ tools: PfTool[], label?: string }>()
const active = defineModel<string | null>({ default: null })
const emit = defineEmits<{ pick: [id: string] }>()
const t = useT()
const root = ref<HTMLElement>()

function focusAt(i: number) {
  const n = props.tools.length
  root.value?.querySelectorAll<HTMLElement>('button')[(i + n) % n]?.focus()
}
function onKey(e: KeyboardEvent, i: number) {
  if (e.key === 'ArrowRight') { e.preventDefault(); focusAt(i + 1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1) }
  else if (e.key === 'Home') { e.preventDefault(); focusAt(0) }
  else if (e.key === 'End') { e.preventDefault(); focusAt(props.tools.length - 1) }
}
function pick(id: string) {
  active.value = id
  emit('pick', id)
}
const tabStop = computed(() => (props.tools.some(x => x.id === active.value) ? active.value : props.tools[0]?.id))
</script>

<template>
  <div ref="root" class="pf-tray" role="toolbar" :aria-label="label ?? t('tray.label', 'Tools')">
    <button
      v-for="(tool, i) in tools"
      :key="tool.id"
      type="button"
      class="pf-tray__tool"
      :class="{ 'is-active': tool.id === active }"
      :aria-pressed="tool.id === active"
      :tabindex="tool.id === tabStop ? 0 : -1"
      @click="pick(tool.id)"
      @keydown="onKey($event, i)"
    >
      <component :is="tool.icon" :size="22" aria-hidden="true" />
      <span>{{ tool.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.pf-tray {
  display: flex;
  gap: var(--pf-1);
  padding: var(--pf-2);
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--pf-paper);
  scroll-padding-inline: var(--pf-4);
}
.pf-tray::-webkit-scrollbar {
  display: none;
}
.pf-tray__tool {
  flex: 1 0 auto;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--pf-1);
  min-width: calc(var(--pf-16) + var(--pf-2));
  max-width: calc(var(--pf-24) + var(--pf-6));
  min-height: var(--pf-16);
  padding: var(--pf-2) var(--pf-2);
  border: 0;
  border-radius: var(--pf-r-control);
  background: transparent;
  color: var(--pf-ink);
  font: inherit;
  font-size: var(--pf-t-small);
  line-height: 1.2;
  font-weight: var(--pf-w-medium);
  text-align: center;
  cursor: pointer;
  transition: background-color var(--pf-d-press) var(--pf-ease);
}
.pf-tray__tool:hover {
  background: var(--pf-well);
}
.pf-tray__tool.is-active {
  background: var(--pf-ink);
  color: var(--pf-on-ink);
}
.pf-tray__tool:focus-visible {
  outline-offset: calc(var(--pf-focus) * -1 - var(--pf-hair));
}
</style>
