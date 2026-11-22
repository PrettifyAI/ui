import type { Ref } from 'vue'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
let locks = 0

/**
 * What every modal surface needs: focus moves in and is kept in, Escape
 * closes, the page behind does not scroll, and focus returns to where it was.
 */
export function usePfOverlay(open: Ref<boolean>, el: Ref<HTMLElement | undefined>, close: () => void, modal: () => boolean = () => true) {
  let returnTo: HTMLElement | null = null
  let locked = false

  function onKey(e: KeyboardEvent) {
    if (!open.value || !el.value) return
    if (e.key === 'Escape') { e.stopPropagation(); close(); return }
    if (e.key !== 'Tab' || !modal()) return
    const items = Array.from(el.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(n => n.offsetParent !== null)
    if (!items.length) { e.preventDefault(); return }
    const first = items[0]!
    const last = items[items.length - 1]!
    const a = document.activeElement
    if (e.shiftKey && (a === first || !el.value.contains(a))) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && (a === last || !el.value.contains(a))) { e.preventDefault(); first.focus() }
  }
  function lock(on: boolean) {
    if (on === locked) return
    locked = on
    locks += on ? 1 : -1
    document.documentElement.style.overflow = locks > 0 ? 'hidden' : ''
  }

  watch(open, async (v) => {
    if (!import.meta.client) return
    if (v) {
      returnTo = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKey, true)
      if (modal()) {
        lock(true)
        await nextTick()
        const target = el.value?.querySelector<HTMLElement>('[data-autofocus]') ?? el.value
        target?.focus({ preventScroll: true })
      }
    }
    else {
      document.removeEventListener('keydown', onKey, true)
      lock(false)
      returnTo?.focus?.({ preventScroll: true })
      returnTo = null
    }
  }, { immediate: true, flush: 'post' })

  onBeforeUnmount(() => {
    if (!import.meta.client) return
    document.removeEventListener('keydown', onKey, true)
    lock(false)
  })
}
