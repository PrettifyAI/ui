export interface PfToastItem {
  id: number
  message: string
  tone?: 'plain' | 'danger'
  action?: { label: string, run: () => void }
  /** ms; 0 keeps it until dismissed. */
  duration: number
}
let seq = 0

/** One line of feedback after an action, with at most one way to act on it
    ("Posted" + "View", "Deleted 3 photos" + "Undo"). */
export function usePfToast() {
  const items = useState<PfToastItem[]>('pf-toasts', () => [])
  function dismiss(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }
  function show(message: string, opts: Partial<Omit<PfToastItem, 'id' | 'message'>> = {}) {
    const item: PfToastItem = { id: ++seq, message, duration: opts.action ? 10_000 : 4_000, ...opts }
    items.value = [...items.value.slice(-2), item]
    if (import.meta.client && item.duration > 0) setTimeout(() => dismiss(item.id), item.duration)
    return item.id
  }
  return { items, show, dismiss }
}
