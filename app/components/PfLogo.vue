<script setup lang="ts">
/** The mark: the word with the seam through it. Plain letters before the
    seam, the same letters flared after it: "developed". */
withDefaults(defineProps<{ size?: 's' | 'm' | 'l' }>(), { size: 'm' })
</script>

<template>
  <span class="pf-logo" :class="`pf-logo--${size}`" role="img" aria-label="Prettify">
    <span aria-hidden="true" class="pf-logo__plain">Pret</span>
    <span aria-hidden="true" class="pf-logo__seam" />
    <span aria-hidden="true" class="pf-logo__flared">tify</span>
  </span>
</template>

<style scoped>
.pf-logo {
  display: inline-flex;
  align-items: center;
  font-size: var(--pf-t-title);
  font-weight: var(--pf-w-strong);
  letter-spacing: var(--pf-track-display);
  line-height: 1;
  color: var(--pf-ink);
  white-space: nowrap;
}
.pf-logo--s { font-size: var(--pf-t-body); }
.pf-logo--l { font-size: var(--pf-t-display-m); }
.pf-logo__plain {
  font-variation-settings: 'FLAR' 0, 'VOLM' 0;
}
.pf-logo__flared {
  font-variation-settings: 'FLAR' 100, 'VOLM' 0;
}
.pf-logo__seam {
  width: var(--pf-seam-w);
  height: 1.7em;
  margin: -0.35em 0.02em -0.35em 0.03em;
  background: var(--pf-seam);
}
</style>
