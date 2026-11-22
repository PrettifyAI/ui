import type { Translate } from '../composables/useT'

/** "about 40 s" / "about 4 min": a rounded, honest duration for waiting copy. */
export function roughDuration(seconds: number, t: Translate): string {
  const s = Math.max(0, Math.round(seconds))
  if (s < 90) {
    const n = s <= 10 ? Math.max(5, Math.ceil(s / 5) * 5) : Math.ceil(s / 10) * 10
    return t('time.about_seconds', 'about {n} s', { n })
  }
  return t('time.about_minutes', 'about {n} min', { n: Math.ceil(s / 60) })
}

export interface DevelopState {
  status: 'queued' | 'running'
  position?: number
  estStart?: string
  startedAt?: string
  estSeconds?: number
  kind?: 'photo' | 'video'
}

/**
 * The one honest line for a job in progress, built only from what the server
 * reports: a place in line and an estimated start while it waits, an
 * estimated duration while it is made. Never a percentage, never negative.
 */
export function developLine(s: DevelopState, now: number, t: Translate): string {
  const ord = '{n, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}'
  if (s.status === 'queued') {
    const secs = s.estStart ? (new Date(s.estStart).getTime() - now) / 1000 : undefined
    if (!s.position) return t('develop.waiting', 'Waiting to start')
    if (secs === undefined) return t('develop.in_line', `${ord} in line`, { n: s.position })
    if (secs <= 3) return t('develop.in_line_soon', `${ord} in line, starts in a moment`, { n: s.position })
    return t('develop.in_line_starts', `${ord} in line, starts in {time}`, { n: s.position, time: roughDuration(secs, t) })
  }
  const video = s.kind === 'video'
  const elapsed = s.startedAt ? (now - new Date(s.startedAt).getTime()) / 1000 : 0
  const left = s.estSeconds === undefined ? undefined : s.estSeconds - elapsed
  if (left === undefined) return video ? t('develop.making_video', 'Making your video') : t('develop.making_photo', 'Making your photo')
  if (left <= 4) return t('develop.almost', 'Almost there')
  return video
    ? t('develop.making_video_left', 'Making your video, {time} left', { time: roughDuration(left, t) })
    : t('develop.making_photo_left', 'Making your photo, {time} left', { time: roughDuration(left, t) })
}
