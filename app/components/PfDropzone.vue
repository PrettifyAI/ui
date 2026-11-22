<script setup lang="ts">
import { Camera, ImagePlus, Images } from 'lucide-vue-next'

/**
 * Where a photo arrives: drag it in, paste it, or pick it from the device.
 * On a touch device it offers "Take a photo" and "Choose from library".
 * It says what it accepts before the person finds out by failing.
 *
 * Emits `files` with what passed and `reject` for each file that did not
 * (`type` or `size`); the parent words the message.
 */
const props = withDefaults(defineProps<{
  accept?: string[]
  maxBytes?: number
  multiple?: boolean
  disabled?: boolean
  compact?: boolean
  title?: string
  error?: string
  paste?: boolean
}>(), {
  accept: () => ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  maxBytes: 25 * 1024 * 1024,
  multiple: false,
  paste: true,
})
const emit = defineEmits<{
  files: [files: File[]]
  reject: [info: { file: File, reason: 'type' | 'size' }]
}>()

const t = useT()
const over = ref(false)
const picker = ref<HTMLInputElement>()
const camera = ref<HTMLInputElement>()
let depth = 0

function take(list: FileList | File[] | null | undefined) {
  if (!list || props.disabled) return
  const ok: File[] = []
  for (const f of Array.from(list)) {
    const typed = props.accept.includes(f.type) || (!f.type && /\.(heic|heif)$/i.test(f.name))
    if (!typed) emit('reject', { file: f, reason: 'type' })
    else if (f.size > props.maxBytes) emit('reject', { file: f, reason: 'size' })
    else ok.push(f)
    if (!props.multiple && ok.length) break
  }
  if (ok.length) emit('files', ok)
}
function onDrop(e: DragEvent) {
  depth = 0
  over.value = false
  take(e.dataTransfer?.files)
}
function onPaste(e: ClipboardEvent) {
  if (!props.paste || props.disabled) return
  const files = Array.from(e.clipboardData?.files ?? [])
  if (files.length) { e.preventDefault(); take(files) }
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  take(input.files)
  input.value = ''
}
onMounted(() => window.addEventListener('paste', onPaste))
onBeforeUnmount(() => window.removeEventListener('paste', onPaste))

const limit = computed(() => Math.round(props.maxBytes / (1024 * 1024)))
defineExpose({ open: () => picker.value?.click() })
</script>

<template>
  <div
    class="pf-drop"
    :class="{ 'is-over': over, 'is-disabled': disabled, 'pf-drop--compact': compact, 'has-error': !!error }"
    @dragenter.prevent="depth++; over = true"
    @dragover.prevent
    @dragleave.prevent="--depth <= 0 && (over = false)"
    @drop.prevent="onDrop"
  >
    <input ref="picker" class="pf-sr" type="file" tabindex="-1" aria-hidden="true" :accept="accept.join(',')" :multiple="multiple" @change="onPick">
    <input ref="camera" class="pf-sr" type="file" tabindex="-1" aria-hidden="true" accept="image/*" capture="environment" @change="onPick">

    <ImagePlus class="pf-drop__icon" :size="28" aria-hidden="true" />
    <p class="pf-drop__title" :class="compact ? 'pf-title' : 'pf-display-m'">
      <template v-if="over">{{ t('dropzone.release', 'Drop it here') }}</template>
      <template v-else>{{ title ?? t('dropzone.title', 'Add a photo') }}</template>
    </p>
    <p class="pf-drop__how pf-body pf-quiet">
      {{ multiple
        ? t('dropzone.how_many', 'Drag photos here, paste, or choose from your device.')
        : t('dropzone.how', 'Drag a photo here, paste it, or choose one from your device.') }}
    </p>

    <div class="pf-drop__actions">
      <PfButton class="pf-drop__touch" variant="primary" :disabled="disabled" @click="camera?.click()">
        <template #icon><Camera :size="20" aria-hidden="true" /></template>
        {{ t('dropzone.camera', 'Take a photo') }}
      </PfButton>
      <PfButton class="pf-drop__touch" :disabled="disabled" @click="picker?.click()">
        <template #icon><Images :size="20" aria-hidden="true" /></template>
        {{ t('dropzone.library', 'Choose from library') }}
      </PfButton>
      <PfButton class="pf-drop__mouse" variant="primary" :disabled="disabled" @click="picker?.click()">
        {{ multiple ? t('dropzone.browse_many', 'Choose photos') : t('dropzone.browse', 'Choose a photo') }}
      </PfButton>
      <slot name="actions" />
    </div>

    <p v-if="error" class="pf-small pf-drop__error" role="alert">{{ error }}</p>
    <p v-else class="pf-small pf-quiet">
      {{ t('dropzone.accepts', 'JPEG, PNG, WebP or HEIC, up to {mb} MB each.', { mb: limit }) }}
    </p>
  </div>
</template>

<style scoped>
.pf-drop {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: var(--pf-2);
  padding: var(--pf-12) var(--pf-5);
  border: var(--pf-hair) dashed var(--pf-line-strong);
  border-radius: var(--pf-r-sheet);
  background: var(--pf-paper);
  text-align: center;
  transition: background-color var(--pf-d-press) var(--pf-ease);
}
.pf-drop--compact {
  padding: var(--pf-6) var(--pf-4);
}
.pf-drop.is-over {
  border-style: solid;
  border-color: var(--pf-blue);
  outline: var(--pf-focus) solid var(--pf-blue);
  outline-offset: calc(var(--pf-focus) * -1);
  background: var(--pf-well);
}
.pf-drop.has-error {
  border-color: var(--pf-danger);
}
.pf-drop__icon {
  color: var(--pf-ink-2);
}
.pf-drop__title {
  margin: 0;
}
.pf-drop__how {
  max-width: 44ch;
  margin: 0;
}
.pf-drop__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--pf-2);
  margin: var(--pf-3) 0 var(--pf-2);
}
.pf-drop__error {
  color: var(--pf-danger);
  margin: 0;
}
.pf-drop p.pf-small {
  margin: 0;
}
/* Pointer decides which buttons make sense, not width: a phone has a camera,
   a laptop has a file browser (and dragging, which the text already says). */
.pf-drop__touch { display: none; }
@media (hover: none) and (pointer: coarse) {
  .pf-drop__touch { display: inline-flex; }
  .pf-drop__mouse { display: none; }
  .pf-drop__how { display: none; }
  .pf-drop__actions { width: 100%; flex-direction: column; align-items: stretch; }
}
.is-disabled {
  opacity: 0.55;
}
</style>
