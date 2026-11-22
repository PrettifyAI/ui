<script setup lang="ts">
/** A single-line input with its label above, a hint or an error below. */
const props = defineProps<{
  label: string
  type?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  hideLabel?: boolean
  autocomplete?: string
}>()
const model = defineModel<string>({ default: '' })
const id = useId()
const describedBy = computed(() => (props.error || props.hint ? `${id}-d` : undefined))
</script>

<template>
  <div class="pf-field" :class="{ 'has-error': !!error, 'is-disabled': disabled }">
    <label :for="id" class="pf-label" :class="{ 'pf-sr': hideLabel }">{{ label }}</label>
    <div class="pf-field__box">
      <slot name="icon" />
      <input
        :id="id"
        v-model="model"
        class="pf-field__input"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
      >
      <slot name="trailing" />
    </div>
    <p v-if="error || hint" :id="`${id}-d`" class="pf-small pf-field__note">{{ error || hint }}</p>
  </div>
</template>

<style scoped>
.pf-field {
  display: grid;
  gap: var(--pf-1);
}
.pf-field__box {
  display: flex;
  align-items: center;
  gap: var(--pf-2);
  min-height: var(--pf-control-h);
  padding: 0 var(--pf-3);
  border: var(--pf-hair) solid var(--pf-line-strong);
  border-radius: var(--pf-r-control);
  background: var(--pf-paper);
  color: var(--pf-ink-2);
}
.pf-field__box:hover {
  border-color: var(--pf-ink);
}
.pf-field__box:focus-within {
  outline: var(--pf-focus) solid var(--pf-blue);
  outline-offset: var(--pf-focus-gap);
}
.pf-field__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--pf-ink);
  font: inherit;
  outline: none;
  padding: var(--pf-2) 0;
}
.pf-field__input::placeholder {
  color: var(--pf-ink-2);
}
.pf-field__note {
  color: var(--pf-ink-2);
}
.has-error .pf-field__box {
  border-color: var(--pf-danger);
}
.has-error .pf-field__note {
  color: var(--pf-danger);
}
.is-disabled {
  opacity: 0.5;
}
</style>
