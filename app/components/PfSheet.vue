<script setup lang="ts">
import { X } from 'lucide-vue-next'

/**
 * One surface, two shapes, same content: a bottom sheet on a phone, a side
 * panel on a desktop. It is the system's single elevation.
 *
 *  - Modal (default): teleported over a scrim; focus is kept inside, Escape
 *    and the scrim close it, swiping the header down closes it on a phone.
 *  - `docked`: stays in the page flow (the editor's tool options). On a phone
 *    it still looks like a sheet rising from the tray; on a desktop it is the
 *    right-hand panel. The canvas behind stays usable.
 */
const props = withDefaults(defineProps<{
  title: string
  docked?: boolean
  closable?: boolean
  hideTitle?: boolean
}>(), { closable: true })
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [] }>()
const t = useT()
const el = ref<HTMLElement>()
const id = useId()

function close() {
  open.value = false
  emit('close')
}
usePfOverlay(open, el, close, () => !props.docked)

// Swipe the header down to close (phone).
const drag = ref(0)
let startY: number | null = null
function onDown(e: PointerEvent) {
  if (props.docked || e.pointerType === 'mouse') return
  startY = e.clientY
}
function onMove(e: PointerEvent) {
  if (startY === null) return
  drag.value = Math.max(0, e.clientY - startY)
}
function onUp() {
  if (startY === null) return
  startY = null
  if (drag.value > 90) close()
  drag.value = 0
}
</script>

<template>
  <section
    v-if="docked"
    v-show="open"
    ref="el"
    class="pf-sheet pf-sheet--docked"
    :class="{ 'pf-sheet--untitled': hideTitle }"
    :aria-labelledby="`${id}-t`"
  >
    <header class="pf-sheet__head">
      <h2 :id="`${id}-t`" class="pf-title" :class="{ 'pf-sr': hideTitle }">{{ title }}</h2>
      <slot name="head" />
      <PfIconButton v-if="closable" class="pf-sheet__close" :label="t('sheet.close', 'Close')" @click="close">
        <X :size="20" />
      </PfIconButton>
    </header>
    <div class="pf-sheet__body"><slot /></div>
    <footer v-if="$slots.footer" class="pf-sheet__foot"><slot name="footer" /></footer>
  </section>

  <Teleport v-else to="body">
    <Transition name="pf-sheet">
      <div v-if="open" class="pf-sheet-layer">
        <div class="pf-sheet-layer__scrim" @click="close" />
        <section
          ref="el"
          class="pf-sheet pf-sheet--modal"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-labelledby="`${id}-t`"
          :style="drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined"
        >
          <header
            class="pf-sheet__head"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onUp"
          >
            <span class="pf-sheet__grab" aria-hidden="true" />
            <h2 :id="`${id}-t`" class="pf-title" :class="{ 'pf-sr': hideTitle }">{{ title }}</h2>
            <slot name="head" />
            <PfIconButton v-if="closable" class="pf-sheet__close" :label="t('sheet.close', 'Close')" @click="close">
              <X :size="20" />
            </PfIconButton>
          </header>
          <div class="pf-sheet__body"><slot /></div>
          <footer v-if="$slots.footer" class="pf-sheet__foot"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pf-sheet {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--pf-paper);
  color: var(--pf-ink);
  outline: none;
}
.pf-sheet__head {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--pf-2);
  min-height: var(--pf-tap);
  padding: var(--pf-3) var(--pf-2) var(--pf-1) var(--pf-5);
  touch-action: none;
}
.pf-sheet__head h2 {
  flex: 1;
  min-width: 0;
}
.pf-sheet__close {
  margin-inline-start: auto;
}
.pf-sheet__grab {
  position: absolute;
  top: var(--pf-2);
  left: 50%;
  width: var(--pf-10);
  height: var(--pf-1);
  margin-left: calc(var(--pf-10) / -2);
  border-radius: var(--pf-r-round);
  background: var(--pf-line-strong);
}
.pf-sheet__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--pf-2) var(--pf-5) var(--pf-5);
}
.pf-sheet__foot {
  display: grid;
  gap: var(--pf-2);
  padding: var(--pf-3) var(--pf-5) calc(var(--pf-4) + var(--pf-safe-b));
  border-top: var(--pf-hair) solid var(--pf-line);
}

/* ── modal ──────────────────────────────────────────────────────────────── */
.pf-sheet-layer {
  position: fixed;
  inset: 0;
  z-index: var(--pf-z-sheet);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.pf-sheet-layer__scrim {
  position: absolute;
  inset: 0;
  background: var(--pf-scrim);
}
.pf-sheet--modal {
  position: relative;
  width: 100%;
  max-height: min(88dvh, calc(100dvh - var(--pf-safe-t) - var(--pf-12)));
  border-radius: var(--pf-r-sheet) var(--pf-r-sheet) 0 0;
  box-shadow: var(--pf-lift);
  transition: transform var(--pf-d-move) var(--pf-ease);
}
.pf-sheet--modal .pf-sheet__head {
  padding-top: var(--pf-5);
}
.pf-sheet--modal .pf-sheet__body {
  padding-bottom: calc(var(--pf-5) + var(--pf-safe-b));
}
.pf-sheet--modal .pf-sheet__foot + * { padding-bottom: 0; }

.pf-sheet-enter-active,
.pf-sheet-leave-active {
  transition: opacity var(--pf-d-move) linear;
}
.pf-sheet-enter-active .pf-sheet--modal,
.pf-sheet-leave-active .pf-sheet--modal {
  transition: transform var(--pf-d-move) var(--pf-ease);
}
.pf-sheet-enter-from,
.pf-sheet-leave-to {
  opacity: 0;
}
.pf-sheet-enter-from .pf-sheet--modal,
.pf-sheet-leave-to .pf-sheet--modal {
  transform: translateY(100%);
}

/* ── docked, phone: a sheet rising from the tray ─────────────────────────── */
.pf-sheet--docked {
  border-radius: var(--pf-r-sheet) var(--pf-r-sheet) 0 0;
  box-shadow: var(--pf-lift);
  max-height: 52dvh;
  position: relative;
  z-index: 1;
}

/* No visible title: the close button floats, the content starts at the top. */
.pf-sheet--untitled .pf-sheet__head {
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  padding: var(--pf-1);
  z-index: 1;
}
.pf-sheet--untitled .pf-sheet__body {
  padding-top: var(--pf-5);
}

@media (min-width: 900px) {
  .pf-sheet-layer {
    align-items: stretch;
    justify-content: flex-end;
  }
  .pf-sheet--modal {
    width: min(var(--pf-panel-w) + var(--pf-16), 100%);
    max-height: none;
    border-radius: var(--pf-r-sheet) 0 0 var(--pf-r-sheet);
  }
  .pf-sheet__grab {
    display: none;
  }
  .pf-sheet-enter-from .pf-sheet--modal,
  .pf-sheet-leave-to .pf-sheet--modal {
    transform: translateX(100%);
  }
  /* docked, desktop: the right-hand panel, part of the layout */
  .pf-sheet--docked {
    width: var(--pf-panel-w);
    max-height: none;
    border-radius: 0;
    box-shadow: none;
    border-inline-start: var(--pf-hair) solid var(--pf-line);
  }
  .pf-sheet--docked .pf-sheet__close {
    display: none;
  }
  .pf-sheet--docked .pf-sheet__head {
    padding-top: var(--pf-5);
  }
}
</style>
