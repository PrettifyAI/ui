import { formatMessage } from '../utils/icu'

export type Translate = (key: string, fallback?: string, params?: Record<string, unknown>) => string

/**
 * `t('key', 'English default', params?)`.
 *
 * The consuming app provides `$t` (a plugin that loads the backend catalogue).
 * Without one — the layer's own playground, a unit test — the English default
 * written at the call site is formatted and returned, so a component never
 * renders a bare key.
 */
export function useT(): Translate {
  const app = useNuxtApp() as unknown as { $t?: Translate }
  return (key, fallback, params) =>
    app.$t ? app.$t(key, fallback, params) : formatMessage(fallback ?? key, params)
}
