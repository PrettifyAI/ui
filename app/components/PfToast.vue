<script setup lang="ts">
import { X } from 'lucide-vue-next'

/** The toast stack. Mount once, in app.vue; call `usePfToast().show()`. */
const { items, dismiss } = usePfToast()
const t = useT()
</script>

<template>
  <div class="pf-toasts" role="region" :aria-label="t('toast.region', 'Messages')">
    <TransitionGroup name="pf-toast">
      <div
        v-for="item in items"
        :key="item.id"
        class="pf-toast"
        :class="`pf-toast--${item.tone ?? 'plain'}`"
        :role="item.tone === 'danger' ? 'alert' : 'status'"
      >
        <p class="pf-label">{{ item.message }}</p>
        <button v-if="item.action" type="button" class="pf-toast__action" @click="item.action.run(); dismiss(item.id)">
          {{ item.action.label }}
        </button>
        <button type="button" class="pf-toast__x" :aria-label="t('toast.dismiss', 'Dismiss')" @click="dismiss(item.id)">
          <X :size="18" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.pf-toasts {
  position: fixed;
  z-index: var(--pf-z-toast);
  left: 0;
  right: 0;
  bottom: calc(var(--pf-tabbar-h) + var(--pf-safe-b) + var(--pf-3));
  display: grid;
  justify-items: center;
  gap: var(--pf-2);
  padding: 0 var(--pf-3);
  pointer-events: none;
}
.pf-toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--pf-2);
  max-width: min(100%, 34rem);
  padding: var(--pf-1) var(--pf-1) var(--pf-1) var(--pf-4);
  border-radius: var(--pf-r-control);
  background: var(--pf-ink);
  color: var(--pf-on-ink);
  box-shadow: var(--pf-lift);
}
.pf-toast p {
  margin: 0;
  flex: 1;
  padding: var(--pf-2) 0;
}
.pf-toast--danger {
  background: var(--pf-danger);
  color: var(--pf-on-danger);
}
.pf-toast__action,
.pf-toast__x {
  min-height: var(--pf-tap);
  min-width: var(--pf-tap);
  display: inline-grid;
  place-items: center;
  padding: 0 var(--pf-3);
  border: 0;
  border-radius: calc(var(--pf-r-control) - var(--pf-1));
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--pf-t-label);
  font-weight: var(--pf-w-strong);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  cursor: pointer;
}
.pf-toast__x {
  padding: 0;
  text-decoration: none;
  opacity: 0.8;
}
.pf-toast__action:focus-visible,
.pf-toast__x:focus-visible {
  outline-color: var(--pf-on-ink);
}
.pf-toast-enter-active,
.pf-toast-leave-active {
  transition: opacity var(--pf-d-move) linear, transform var(--pf-d-move) var(--pf-ease);
}
.pf-toast-enter-from,
.pf-toast-leave-to {
  opacity: 0;
  transform: translateY(var(--pf-2));
}
@media (min-width: 900px) {
  .pf-toasts { bottom: var(--pf-6); }
}
</style>
