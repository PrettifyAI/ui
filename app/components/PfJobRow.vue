<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { PfStatusName } from './PfStatus.vue'

/** One job in a list: the photo, what was asked, where it stands. While it is
    being made a small seam sweeps under the thumbnail. */
defineProps<{
  src: string
  width: number
  height: number
  title: string
  status: PfStatusName | 'queued' | 'running' | 'succeeded'
  /** The honest line: "2nd in line, starts in about 20 s". */
  line?: string
  /** Quiet facts: credits used, time taken. */
  meta?: string
  to?: RouteLocationRaw
}>()
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="pf-job" :class="`pf-job--${status}`">
    <component :is="to ? NuxtLink : 'div'" :to="to" class="pf-job__thumb" :aria-label="to ? title : undefined">
      <img :src="src" alt="" :width="width" :height="height" loading="lazy">
      <span v-if="status === 'running' || status === 'making'" class="pf-job__seam" aria-hidden="true" />
    </component>
    <div class="pf-job__text">
      <p class="pf-label pf-job__title">{{ title }}</p>
      <p class="pf-job__state">
        <PfStatus :status="status" />
        <span v-if="line" class="pf-small pf-num" :class="status === 'failed' ? 'pf-job__fail' : 'pf-quiet'">{{ line }}</span>
      </p>
      <p v-if="meta" class="pf-small pf-quiet pf-num">{{ meta }}</p>
    </div>
    <div v-if="$slots.default" class="pf-job__actions"><slot /></div>
  </div>
</template>

<style scoped>
.pf-job {
  display: grid;
  grid-template-columns: var(--pf-thumb) minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--pf-3);
  padding: var(--pf-3) 0;
}
.pf-job + .pf-job {
  border-top: var(--pf-hair) solid var(--pf-line);
}
.pf-job__thumb {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--pf-thumb);
  height: var(--pf-thumb);
  background: var(--pf-well);
  overflow: hidden;
}
.pf-job__thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.pf-job__seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--pf-seam-w);
  background: var(--pf-seam);
  animation: pf-job-sweep var(--pf-d-sweep) var(--pf-ease-sweep) infinite alternate;
}
@keyframes pf-job-sweep {
  to { left: calc(100% - var(--pf-seam-w)); }
}
@media (prefers-reduced-motion: reduce) {
  .pf-job__seam { animation: none; top: auto; width: 100%; height: var(--pf-seam-w); }
}
.pf-job__text {
  display: grid;
  gap: var(--pf-0h);
  min-width: 0;
}
.pf-job__text p {
  margin: 0;
}
.pf-job__title {
  overflow-wrap: anywhere;
}
.pf-job__state {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--pf-1) var(--pf-2);
}
.pf-job__fail {
  color: var(--pf-danger);
}
.pf-job__actions {
  display: flex;
  gap: var(--pf-1);
}
@media (max-width: 520px) {
  .pf-job { grid-template-columns: var(--pf-thumb) minmax(0, 1fr); }
  .pf-job__actions { grid-column: 2; justify-content: flex-start; }
}
</style>
