<script setup lang="ts">
/** A question that must be answered before going on (delete, a secret shown
    once). Centred, modal, with its actions at the bottom. */
defineProps<{ title: string, text?: string }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [] }>()
const el = ref<HTMLElement>()
const id = useId()
function close() { open.value = false; emit('close') }
usePfOverlay(open, el, close)
</script>

<template>
  <Teleport to="body">
    <Transition name="pf-dialog">
      <div v-if="open" class="pf-dialog-layer">
        <div class="pf-dialog-layer__scrim" @click="close" />
        <section
          ref="el"
          class="pf-dialog"
          role="alertdialog"
          aria-modal="true"
          tabindex="-1"
          :aria-labelledby="`${id}-t`"
          :aria-describedby="text ? `${id}-d` : undefined"
        >
          <h2 :id="`${id}-t`" class="pf-title">{{ title }}</h2>
          <p v-if="text" :id="`${id}-d`" class="pf-body pf-quiet">{{ text }}</p>
          <div v-if="$slots.default" class="pf-dialog__body"><slot /></div>
          <footer class="pf-dialog__actions"><slot name="actions" :close="close" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pf-dialog-layer {
  position: fixed;
  inset: 0;
  z-index: var(--pf-z-dialog);
  display: grid;
  place-items: center;
  padding: var(--pf-4);
}
.pf-dialog-layer__scrim {
  position: absolute;
  inset: 0;
  background: var(--pf-scrim);
}
.pf-dialog {
  position: relative;
  display: grid;
  gap: var(--pf-3);
  width: min(100%, 30rem);
  max-height: 100%;
  overflow-y: auto;
  padding: var(--pf-6);
  border-radius: var(--pf-r-sheet);
  background: var(--pf-paper);
  box-shadow: var(--pf-lift);
  outline: none;
}
.pf-dialog p {
  margin: 0;
}
.pf-dialog__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--pf-2);
  margin-top: var(--pf-3);
}
.pf-dialog-enter-active,
.pf-dialog-leave-active {
  transition: opacity var(--pf-d-move) linear;
}
.pf-dialog-enter-from,
.pf-dialog-leave-to {
  opacity: 0;
}
@media (max-width: 520px) {
  .pf-dialog__actions { flex-direction: column-reverse; }
  .pf-dialog__actions :deep(.pf-btn) { width: 100%; }
}
</style>
