<script setup lang="ts">
/** "Describe the change". Starts at two lines and grows to `maxRows`, then
    scrolls. The label is always present for assistive tech. */
const props = withDefaults(defineProps<{
  label: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  maxRows?: number
  maxlength?: number
  hideLabel?: boolean
}>(), { maxRows: 4 })
const model = defineModel<string>({ default: '' })
const id = useId()
const el = ref<HTMLTextAreaElement>()

function grow() {
  const t = el.value
  if (!t) return
  t.style.height = 'auto'
  const cs = getComputedStyle(t)
  const line = Number.parseFloat(cs.lineHeight) || 24
  const pad = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom)
  const max = line * props.maxRows + pad
  t.style.height = `${Math.min(t.scrollHeight, max)}px`
  t.style.overflowY = t.scrollHeight > max ? 'auto' : 'hidden'
}
watch(model, () => nextTick(grow))
onMounted(grow)
defineExpose({ focus: () => el.value?.focus() })
</script>

<template>
  <div class="pf-ta" :class="{ 'has-error': !!error }">
    <label :for="id" class="pf-label" :class="{ 'pf-sr': hideLabel }">{{ label }}</label>
    <textarea
      :id="id"
      ref="el"
      v-model="model"
      class="pf-ta__input"
      rows="2"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-invalid="!!error || undefined"
      :aria-describedby="error || hint ? `${id}-d` : undefined"
    />
    <div v-if="error || hint || maxlength" class="pf-ta__foot pf-small">
      <span :id="`${id}-d`">{{ error || hint }}</span>
      <span v-if="maxlength" class="pf-num" aria-hidden="true">{{ model.length }} / {{ maxlength }}</span>
    </div>
  </div>
</template>

<style scoped>
.pf-ta {
  display: grid;
  gap: var(--pf-1);
}
.pf-ta__input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  padding: var(--pf-3);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
  color: var(--pf-ink);
  font: inherit;
  line-height: var(--pf-lh-body);
}
.pf-ta__input:hover {
  border-color: var(--pf-ink);
}
.pf-ta__input::placeholder {
  color: var(--pf-ink-2);
}
.pf-ta__input:disabled {
  opacity: 0.5;
}
.pf-ta__foot {
  display: flex;
  justify-content: space-between;
  gap: var(--pf-3);
  color: var(--pf-ink-2);
}
.has-error .pf-ta__input {
  border-color: var(--pf-danger);
}
.has-error .pf-ta__foot span:first-child {
  color: var(--pf-danger);
}
</style>
