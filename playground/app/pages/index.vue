<script setup lang="ts">
import {
  Bell, Camera, Crop, Eraser, Film, Home, Images, Rotate3d, Scaling, Search, Trash2, User, Users, SunMedium, PenLine,
} from 'lucide-vue-next'

const t = useT()
const toast = usePfToast()

const D = '/demo'
const photos = [
  { id: 'smile', src: `${D}/smile-s.jpg`, width: 1600, height: 1048, alt: 'A smiling man in a red T-shirt in a crowd' },
  { id: 'cappuccino', src: `${D}/cappuccino-s.jpg`, width: 1066, height: 1600, alt: 'A cappuccino and a croissant' },
  { id: 'stick', src: `${D}/stick-s.jpg`, width: 1600, height: 1600, alt: 'A golden retriever chewing a stick' },
  { id: 'kitchen', src: `${D}/kitchen-s.jpg`, width: 1600, height: 1066, alt: 'A white and blue kitchen' },
  { id: 'picnic', src: `${D}/picnic-s.jpg`, width: 1064, height: 1600, alt: 'A family picnic below a castle' },
  { id: 'golden', src: `${D}/golden-s.jpg`, width: 1600, height: 1062, alt: 'A golden retriever in the shade', video: `${D}/golden.mp4`, seconds: 3 },
  { id: 'labrador', src: `${D}/labrador-s.jpg`, width: 1220, height: 1600, alt: 'A brown labrador sitting on grass' },
  { id: 'tagliatelle', src: `${D}/tagliatelle-s.jpg`, width: 1600, height: 1068, alt: 'A bowl of tagliatelle' },
  { id: 'cat', src: `${D}/cat-s.jpg`, width: 1600, height: 1200, alt: 'A ginger cat on a wall' },
  { id: 'sneakers', src: `${D}/sneakers-s.jpg`, width: 1390, height: 1600, alt: 'A pair of beige sneakers' },
  { id: 'sailor', src: `${D}/sailor-s.jpg`, width: 1018, height: 1600, alt: 'A 1920s studio portrait of a boy' },
]

const tokens = [
  ['--pf-table', 'App background'], ['--pf-paper', 'Panels, sheets, the photo\'s edge'], ['--pf-well', 'Pressed tone, placeholder'],
  ['--pf-ink', 'Text, icons, selected'], ['--pf-ink-2', 'Secondary text'], ['--pf-line', 'Dividers'],
  ['--pf-line-strong', 'Control outlines'], ['--pf-blue', 'The one action colour'], ['--pf-seam', 'The seam, progress'],
  ['--pf-danger', 'Destructive, failed'],
]
const ratios = [
  ['ink on table', '15.59', '15.22'], ['ink on paper', '17.65', '13.52'], ['ink-2 on table', '5.49', '7.00'],
  ['ink-2 on paper', '6.21', '6.22'], ['blue on table', '6.26', '6.07'], ['on-blue on blue', '7.40', '6.56'],
  ['danger on table', '4.86', '6.69'], ['line-strong on table (3:1)', '3.12', '3.97'],
]
const scale = [
  { cls: 'pf-display-xl', name: 'Display XL', spec: '44–92 px / 0.98 / 560 / FLAR 100' },
  { cls: 'pf-display-l', name: 'Display L', spec: '34–56 px / 1.04 / 560 / FLAR 100' },
  { cls: 'pf-display-m', name: 'Display M', spec: '26–34 px / 1.14 / 560 / FLAR 70' },
  { cls: 'pf-title', name: 'Title', spec: '20 px / 1.3 / 620 / FLAR 0' },
  { cls: 'pf-body', name: 'Body', spec: '16 px / 1.5 / 400 / FLAR 0' },
  { cls: 'pf-label', name: 'Label', spec: '14 px / 1.35 / 500 / FLAR 0' },
  { cls: 'pf-small', name: 'Small', spec: '13 px / 1.4 / 400 / FLAR 0' },
]
const langs = [
  { code: 'en', lang: 'en', head: 'Your photos, developed.', body: 'Add a photo and choose what to change.', btn: 'Enhance photo' },
  { code: 'de', lang: 'de', head: 'Deine Fotos, entwickelt.', body: 'Füge ein Foto hinzu und wähle, was sich ändern soll.', btn: 'Hintergrund unscharf zeichnen und Foto verbessern' },
  { code: 'ua', lang: 'uk', head: 'Ваші фото, проявлені.', body: 'Додайте фото й оберіть, що змінити.', btn: 'Покращити фото' },
  { code: 'gr', lang: 'el', head: 'Οι φωτογραφίες σας, εμφανισμένες.', body: 'Προσθέστε μια φωτογραφία και επιλέξτε τι θα αλλάξει.', btn: 'Βελτίωση φωτογραφίας' },
]
const motion = [
  ['Control press', '90 ms', 'ease', 'instant'],
  ['Sheet, panel, toast', '220 ms', 'cubic-bezier(.2,.7,.2,1)', 'instant'],
  ['Seam follows finger or pointer', '0 ms (direct)', 'none', 'unchanged'],
  ['Landing: seam enters and settles (once)', '1500 ms', 'ease-out quart', 'starts settled'],
  ['Develop: seam sweep while making', '2600 ms per pass, alternating', 'cubic-bezier(.45,.05,.3,.95)', 'static line along the bottom'],
  ['Photo appears', '220 ms fade', 'linear', 'instant'],
]

const pos = ref(55)
const seg = ref('all')
const chip = ref('natural')
const field = ref('')
const text = ref('Make it golden hour')
const strength = ref(60)
const sw = ref(true)
const sw2 = ref(false)
const lang = ref('en')
const tool = ref<string | null>('edit')
const sheetOpen = ref(false)
const dialogOpen = ref(false)
const paywallOpen = ref(false)
const selected = ref<string[]>(['stick'])
const liked = ref(true)
const following = ref(false)
const kept = ref(false)
const dropError = ref('')
// Fixed on the client only: a server-rendered clock would not match hydration.
const soon = ref<string>()
const started = ref<string>()
onMounted(() => {
  soon.value = new Date(Date.now() + 40_000).toISOString()
  started.value = new Date(Date.now() - 4_000).toISOString()
})

const tools = [
  { id: 'enhance', label: 'Enhance', icon: SunMedium },
  { id: 'edit', label: 'Edit', icon: PenLine },
  { id: 'sharper', label: 'Make it sharper', icon: Scaling },
  { id: 'background', label: 'Remove background', icon: Eraser },
  { id: 'angle', label: 'Change angle', icon: Rotate3d },
  { id: 'animate', label: 'Animate', icon: Film },
  { id: 'crop', label: 'Crop', icon: Crop },
]
const nav = [
  { to: '/', label: 'Studio', icon: Home },
  { to: '/library', label: 'Library', icon: Images },
  { to: '/add', label: 'Add', icon: Camera, primary: true },
  { to: '/feed', label: 'Feed', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: 2 },
  { to: '/profile', label: 'Profile', icon: User },
]
const plans = [
  { id: 'free', name: 'Free', price: '€0', features: ['10 photos a week', 'Videos up to 3 seconds'], current: true },
  { id: 'pro', name: 'Pro', price: '€9', period: 'a month', features: ['300 photos a week', 'Videos up to 5 seconds', 'Full-size downloads'] },
]
const sections = [
  ['foundations', 'Foundations'], ['seam', 'The seam'], ['actions', 'Actions'], ['input', 'Input'], ['photo', 'Photo'],
  ['making', 'Making'], ['structure', 'Structure'], ['people', 'People'], ['money', 'Money and limits'],
  ['status', 'Status language'], ['motion', 'Motion'], ['darkroom', 'Darkroom'], ['dodont', 'Do and don\'t'],
]
</script>

<template>
  <div class="ref">
    <aside class="ref__nav">
      <PfLogo />
      <p class="pf-small pf-quiet">Design system reference. Every component, every state.</p>
      <nav aria-label="Sections">
        <a v-for="[id, name] in sections" :key="id" :href="`#${id}`" class="pf-label">{{ name }}</a>
      </nav>
    </aside>

    <main class="ref__main">
      <header class="ref__intro">
        <h1 class="pf-display-l">A daylight photo studio, not a neon dashboard.</h1>
        <p class="pf-body pf-quiet pf-measure">
          The person's photo is the only colourful thing on screen. Surfaces are true neutral grey so they never tint
          what the eye judges. The before and after seam is the brand. Photos are prints: true aspect, square corners.
        </p>
      </header>

      <!-- ───────────────────────── foundations ───────────────────────── -->
      <section id="foundations" class="ref__sec">
        <h2 class="pf-display-m">Foundations</h2>

        <h3 class="pf-title">Colour, day and darkroom</h3>
        <div class="ref__themes">
          <div v-for="theme in ['day', 'darkroom']" :key="theme" :data-pf-theme="theme" class="ref__theme">
            <p class="pf-label">{{ theme === 'day' ? 'Day (default everywhere)' : 'Darkroom (editor surround)' }}</p>
            <ul class="ref__swatches">
              <li v-for="[name, use] in tokens" :key="name">
                <span class="ref__swatch" :style="{ background: `var(${name})` }" />
                <span class="pf-small"><b>{{ name }}</b><br><span class="pf-quiet">{{ use }}</span></span>
              </li>
            </ul>
          </div>
        </div>
        <table class="ref__table pf-small pf-num">
          <caption class="pf-label">Contrast (WCAG ratio), checked by <code>pnpm test</code></caption>
          <thead><tr><th>Pair</th><th>Day</th><th>Darkroom</th></tr></thead>
          <tbody><tr v-for="r in ratios" :key="r[0]"><td>{{ r[0] }}</td><td>{{ r[1] }} : 1</td><td>{{ r[2] }} : 1</td></tr></tbody>
        </table>

        <h3 class="pf-title">Type: Commissioner, one family</h3>
        <p class="pf-body pf-quiet pf-measure">Display steps turn up the flare axis; text steps do not. Sentence case everywhere. Changing numbers are tabular.</p>
        <div class="ref__flare">
          <p class="ref__flare-0">Developed <span class="pf-small pf-quiet">FLAR 0</span></p>
          <p class="ref__flare-100">Developed <span class="pf-small pf-quiet">FLAR 100</span></p>
        </div>
        <div class="ref__scale">
          <div v-for="s in scale" :key="s.cls" class="ref__scale-row">
            <p :class="s.cls">Your photos, developed</p>
            <p class="pf-small pf-quiet pf-num">{{ s.name }}: {{ s.spec }}</p>
          </div>
        </div>
        <div class="ref__langs">
          <div v-for="l in langs" :key="l.code" :lang="l.lang" class="ref__lang">
            <p class="pf-small pf-quiet">{{ l.code }}</p>
            <p class="pf-display-m">{{ l.head }}</p>
            <p class="pf-body">{{ l.body }}</p>
            <PfButton variant="primary">{{ l.btn }}</PfButton>
          </div>
        </div>

        <h3 class="pf-title">Space, shape, elevation</h3>
        <div class="ref__row">
          <div class="ref__spaces">
            <span v-for="n in ['1', '2', '3', '4', '6', '8', '12', '16']" :key="n" class="pf-small pf-num">
              <i :style="{ width: `var(--pf-${n})`, height: `var(--pf-${n})` }" />{{ n }}
            </span>
          </div>
          <div class="ref__shape" style="border-radius: var(--pf-r-control)"><span class="pf-small">Control 10</span></div>
          <div class="ref__shape" style="border-radius: var(--pf-r-sheet)"><span class="pf-small">Sheet 16</span></div>
          <div class="ref__shape"><span class="pf-small">Photo 0</span></div>
          <div class="ref__shape ref__shape--lift" style="border-radius: var(--pf-r-sheet)"><span class="pf-small">The one elevation</span></div>
        </div>
      </section>

      <!-- ───────────────────────── the seam ───────────────────────── -->
      <section id="seam" class="ref__sec">
        <h2 class="pf-display-m">The seam</h2>
        <p class="pf-body pf-quiet pf-measure">
          A 2 px line of warm light, <code>--pf-seam</code>. It is the compare divider, the progress indicator and the
          logo. Nothing else in the interface is yellow.
        </p>
        <div class="ref__grid3">
          <figure>
            <PfCompare v-model="pos" :before="`${D}/smile-before.jpg`" :after="`${D}/smile.jpg`" :width="1600" :height="1048" before-alt="The photo before" after-alt="The photo after" />
            <figcaption class="pf-small pf-quiet">Compare divider. Drag it, use the arrow keys, or press and hold for the original. Now at {{ Math.round(pos) }}%.</figcaption>
          </figure>
          <figure>
            <PfDevelop :src="`${D}/smile-before-s.jpg`" :width="1600" :height="1048" status="running" :started-at="started" :est-seconds="30" />
            <figcaption class="pf-small pf-quiet">Progress. It sweeps while the result is made; under reduced motion it is a static line.</figcaption>
          </figure>
          <figure class="ref__logos">
            <PfLogo size="l" /><PfLogo /><PfLogo size="s" />
            <PfLogo size="xl" loop />
            <figcaption class="pf-small pf-quiet">Logo. Plain letters before the seam, the same letters flared after it. The large one is developing in a loop, as the page loader shows it.</figcaption>
          </figure>
        </div>
      </section>

      <!-- ───────────────────────── actions ───────────────────────── -->
      <section id="actions" class="ref__sec">
        <h2 class="pf-display-m">Actions</h2>
        <h3 class="pf-title">PfButton</h3>
        <div class="ref__states">
          <div><p class="pf-small pf-quiet">Primary</p><PfButton variant="primary">Enhance photo</PfButton></div>
          <div><p class="pf-small pf-quiet">Quiet</p><PfButton>Try again</PfButton></div>
          <div><p class="pf-small pf-quiet">Ghost</p><PfButton variant="ghost">Compare</PfButton></div>
          <div><p class="pf-small pf-quiet">Destructive</p><PfButton variant="destructive"><template #icon><Trash2 :size="20" /></template>Delete 3 photos</PfButton></div>
          <div><p class="pf-small pf-quiet">With icon</p><PfButton variant="primary"><template #icon><SunMedium :size="20" /></template>Enhance photo</PfButton></div>
          <div><p class="pf-small pf-quiet">Loading</p><PfButton variant="primary" loading>Enhancing</PfButton></div>
          <div><p class="pf-small pf-quiet">Disabled</p><PfButton variant="primary" disabled>Enhance photo</PfButton></div>
          <div><p class="pf-small pf-quiet">Small</p><PfButton size="s">Cancel</PfButton></div>
        </div>
        <div class="ref__phone">
          <p class="pf-small pf-quiet">Full width on a phone; a long German label wraps instead of clipping</p>
          <PfButton variant="primary" block>Hintergrund unscharf zeichnen und Foto verbessern</PfButton>
        </div>

        <h3 class="pf-title">PfIconButton, PfChip, PfSegmented</h3>
        <div class="ref__states">
          <div><p class="pf-small pf-quiet">Ghost</p><PfIconButton label="Search"><Search :size="20" /></PfIconButton></div>
          <div><p class="pf-small pf-quiet">Quiet</p><PfIconButton variant="quiet" label="Search"><Search :size="20" /></PfIconButton></div>
          <div><p class="pf-small pf-quiet">Pressed</p><PfIconButton label="Darkroom" :pressed="true"><Search :size="20" /></PfIconButton></div>
          <div><p class="pf-small pf-quiet">Disabled</p><PfIconButton label="Search" disabled><Search :size="20" /></PfIconButton></div>
          <div>
            <p class="pf-small pf-quiet">Chips (selected is ink)</p>
            <div class="ref__chips">
              <PfChip v-for="c in ['natural', 'portrait', 'product', 'food', 'interior']" :key="c" :selected="chip === c" @click="chip = c">{{ c[0]!.toUpperCase() + c.slice(1) }}</PfChip>
              <PfChip disabled>Disabled</PfChip>
            </div>
          </div>
          <div>
            <p class="pf-small pf-quiet">Segmented (arrow keys)</p>
            <PfSegmented v-model="seg" label="Show" :options="[{ value: 'all', label: 'All' }, { value: 'photos', label: 'Photos' }, { value: 'videos', label: 'Videos' }, { value: 'originals', label: 'Originals' }, { value: 'posted', label: 'Posted' }]" />
          </div>
        </div>
      </section>

      <!-- ───────────────────────── input ───────────────────────── -->
      <section id="input" class="ref__sec">
        <h2 class="pf-display-m">Input</h2>
        <div class="ref__grid3">
          <div class="ref__stack">
            <PfField v-model="field" label="Name" placeholder="How others see you" hint="You can change this later." />
            <PfField label="Email" model-value="nina@" error="Enter a full email address, like name@example.com." />
            <PfField label="Search" placeholder="beach, golden hour" hide-label><template #icon><Search :size="18" /></template></PfField>
            <PfField label="Disabled" model-value="Not editable" disabled />
          </div>
          <div class="ref__stack">
            <PfTextarea v-model="text" label="Describe the change" placeholder="Remove the people behind me" :maxlength="300" hint="Grows to four lines." />
            <PfTextarea label="Describe the change" model-value="x" error="Say a little more about what should change." />
            <PfSelect v-model="lang" label="Language" :options="[{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'ua', label: 'Українська' }, { value: 'gr', label: 'Ελληνικά' }]" />
          </div>
          <div class="ref__stack">
            <PfSlider v-model="strength" label="Strength" start-label="Subtle" end-label="Strong" />
            <PfSlider label="Strength" :model-value="30" disabled start-label="Subtle" end-label="Strong" />
            <PfSwitch v-model="sw" label="Faces" hint="Repairs faces in portraits." />
            <PfSwitch v-model="sw2" label="Allow remixes" />
            <PfSwitch label="Disabled" disabled />
          </div>
        </div>
        <h3 class="pf-title">PfDropzone</h3>
        <div class="ref__grid2">
          <PfDropzone multiple @files="toast.show(`${$event.length} photo added`)" @reject="dropError = $event.reason === 'size' ? 'That photo is over 25 MB. Choose a smaller one.' : 'That file is not a photo. Choose a JPEG, PNG, WebP or HEIC.'" />
          <div class="ref__stack">
            <PfDropzone compact error="That photo is over 25 MB. Choose a smaller one." />
            <PfDropzone compact disabled title="Uploading 2 photos" />
            <p v-if="dropError" class="pf-small">Last refusal: {{ dropError }}</p>
          </div>
        </div>
      </section>

      <!-- ───────────────────────── photo ───────────────────────── -->
      <section id="photo" class="ref__sec">
        <h2 class="pf-display-m">Photo</h2>
        <h3 class="pf-title">PfPrint: plain, selectable, with status</h3>
        <div class="ref__prints">
          <PfPrint v-bind="photos[1]!" />
          <PfPrint v-bind="photos[2]!" selectable :selected="selected.includes('stick')" @update:selected="selected = $event ? ['stick'] : []" />
          <PfPrint v-bind="photos[3]!"><template #overlay><span class="pf-photo-chip"><PfStatus status="making" /></span></template></PfPrint>
          <PfPrint v-bind="photos[4]!"><template #overlay><span class="pf-photo-chip pf-num">4</span></template>With a stack count</PfPrint>
        </div>
        <h3 class="pf-title">PfVideo</h3>
        <div class="ref__grid2">
          <PfVideo :src="`${D}/golden.mp4`" :poster="`${D}/golden-s.jpg`" :width="1600" :height="1062" :seconds="3" alt="A golden retriever, slowly pushing in" controls />
          <PfVideo :src="`${D}/golden.mp4`" :poster="`${D}/golden-s.jpg`" :width="1600" :height="1062" :seconds="3" alt="A golden retriever" hover-play />
        </div>
        <h3 class="pf-title">PfContactSheet: justified rows, true aspect, virtualised</h3>
        <PfContactSheet v-model:selected="selected" :items="photos" selectable />
      </section>

      <!-- ───────────────────────── making ───────────────────────── -->
      <section id="making" class="ref__sec">
        <h2 class="pf-display-m">Making</h2>
        <h3 class="pf-title">PfToolTray and PfToolPanel</h3>
        <div class="ref__frame">
          <PfToolTray v-model="tool" :tools="tools" />
        </div>
        <div class="ref__grid2">
          <div class="ref__card">
            <PfToolPanel title="Edit" text="Say what should change, in your own words.">
              <PfTextarea v-model="text" label="Describe the change" />
              <div class="ref__chips">
                <PfChip @click="text = 'Make it golden hour'">Make it golden hour</PfChip>
                <PfChip @click="text = 'Remove the people behind'">Remove the people behind</PfChip>
                <PfChip @click="text = 'Put it in a studio'">Put it in a studio</PfChip>
              </div>
              <template #action><PfButton variant="primary" block>Make the change</PfButton></template>
            </PfToolPanel>
          </div>
          <div class="ref__card">
            <PfToolPanel title="Enhance" text="Better light, colour and detail. Nothing to set up.">
              <template #action><PfButton variant="primary" block>Enhance photo</PfButton></template>
            </PfToolPanel>
          </div>
        </div>

        <h3 class="pf-title">PfDevelop: waiting, then making</h3>
        <div class="ref__grid3">
          <PfDevelop :src="`${D}/tagliatelle-before-s.jpg`" :width="1600" :height="1068" status="queued" :position="3" :est-start="soon">
            <PfButton size="s">Cancel</PfButton>
          </PfDevelop>
          <PfDevelop :src="`${D}/tagliatelle-before-s.jpg`" :width="1600" :height="1068" status="running" :started-at="started" :est-seconds="25" />
          <PfDevelop :src="`${D}/golden-s.jpg`" :width="1600" :height="1062" status="running" kind="video" :started-at="started" :est-seconds="240" />
        </div>

        <h3 class="pf-title">PfJobRow</h3>
        <div class="ref__card">
          <PfJobRow :src="`${D}/picnic-before-s.jpg`" :width="1064" :height="1600" title="Make it a sunny day" status="queued" line="2nd in line, starts in about 20 s"><PfButton size="s">Cancel</PfButton></PfJobRow>
          <PfJobRow :src="`${D}/tagliatelle-before-s.jpg`" :width="1600" :height="1068" title="Enhance" status="running" line="about 15 s left" />
          <PfJobRow :src="`${D}/smile-s.jpg`" :width="1600" :height="1048" title="Enhance" status="succeeded" meta="1 credit, took 24 s"><PfButton size="s">Open</PfButton></PfJobRow>
          <PfJobRow :src="`${D}/cat-s.jpg`" :width="1600" :height="1200" title="Animate: slow push in" status="failed" line="We couldn't make this one. Your credit was not used."><PfButton size="s">Try again</PfButton></PfJobRow>
          <PfJobRow :src="`${D}/sneakers-s.jpg`" :width="1390" :height="1600" title="Make it sharper" status="cancelled" />
        </div>

        <h3 class="pf-title">PfResultBar</h3>
        <div class="ref__card"><PfResultBar :kept="kept" @keep="kept = true" @retry="toast.show('Making another take')" /></div>
      </section>

      <!-- ───────────────────────── structure ───────────────────────── -->
      <section id="structure" class="ref__sec">
        <h2 class="pf-display-m">Structure</h2>
        <div class="ref__states">
          <PfButton @click="sheetOpen = true">Open PfSheet</PfButton>
          <PfButton @click="dialogOpen = true">Open PfDialog</PfButton>
          <PfButton @click="paywallOpen = true">Open PfPaywallSheet</PfButton>
          <PfButton @click="toast.show('Posted', { action: { label: 'View', run: () => {} } })">Show PfToast</PfButton>
          <PfButton @click="toast.show('Deleted 3 photos', { action: { label: 'Undo', run: () => {} } })">Toast with Undo</PfButton>
          <PfButton @click="toast.show('We couldn\'t save that. Check your connection and try again.', { tone: 'danger' })">Failure toast</PfButton>
        </div>
        <p class="pf-small pf-quiet">The sheet is a bottom sheet under 900 px and a side panel above it, with the same content.</p>

        <h3 class="pf-title">PfTopBar, PfNavRail (desktop), PfTabBar (phone)</h3>
        <div class="ref__grid2">
          <div class="ref__frame ref__frame--rail">
            <PfNavRail :items="nav" />
            <div class="ref__framebody">
              <PfTopBar title="Library" back="/"><template #actions><PfIconButton label="Search"><Search :size="20" /></PfIconButton></template></PfTopBar>
            </div>
          </div>
          <div class="ref__frame ref__frame--phone">
            <PfTopBar title="Library" />
            <div class="ref__framebody" />
            <PfTabBar :items="nav.filter(n => n.to !== '/notifications')" />
          </div>
        </div>

        <h3 class="pf-title">PfBanner and PfEmpty</h3>
        <div class="ref__stack">
          <PfBanner title="You've used this week's 10 photos" text="They reset on Monday. Pro gives you 300 a week."><PfButton size="s" variant="primary">See plans</PfButton></PfBanner>
          <PfBanner tone="offline" title="You're offline" text="2 photos are waiting to upload. They'll go when you're back." />
          <PfBanner tone="danger" title="Your last payment didn't go through" text="Update your card to keep Pro." dismissible><PfButton size="s">Update card</PfButton></PfBanner>
          <div class="ref__card"><PfEmpty title="Add your first photo" text="Everything you bring in or make is kept here."><PfButton variant="primary">Choose a photo</PfButton></PfEmpty></div>
        </div>
      </section>

      <!-- ───────────────────────── people ───────────────────────── -->
      <section id="people" class="ref__sec">
        <h2 class="pf-display-m">People</h2>
        <div class="ref__grid2">
          <div class="ref__card ref__stack">
            <div class="ref__states">
              <PfAvatar name="Nina Petrenko" size="l" :src="`${D}/smile-s.jpg`" /><PfAvatar name="Nina Petrenko" /><PfAvatar name="Jonas Weber" size="s" />
              <PfLikeButton v-model:liked="liked" :count="liked ? 129 : 128" />
              <PfFollowButton v-model:following="following" />
              <PfFollowButton :following="true" />
              <PfFollowButton loading />
            </div>
            <PfUserRow name="Nina Petrenko" handle="nina" :src="`${D}/smile-s.jpg`"><PfFollowButton v-model:following="following" /></PfUserRow>
            <PfUserRow name="Jonas Weber" handle="jonasw"><PfFollowButton :following="true" /></PfUserRow>
          </div>
          <div class="ref__card ref__stack">
            <PfComment name="Jonas Weber" when="2 h" text="The light on the pasta is exactly right. What did you ask for?" :likes="4">
              <PfComment name="Nina Petrenko" :src="`${D}/smile-s.jpg`" when="1 h" text="Just Enhance, nothing else." :likes="1" />
            </PfComment>
          </div>
        </div>
      </section>

      <!-- ───────────────────────── money ───────────────────────── -->
      <section id="money" class="ref__sec">
        <h2 class="pf-display-m">Money and limits</h2>
        <div class="ref__grid3">
          <PfPlanCard name="Free" price="€0" :features="['10 photos a week', 'Videos up to 3 seconds']" current note="Placeholder numbers." />
          <PfPlanCard name="Pro" price="€9" period="a month" :features="['300 photos a week', 'Videos up to 5 seconds', 'Full-size downloads']" note="Placeholder numbers.">
            <PfButton variant="primary" block>Choose Pro</PfButton>
          </PfPlanCard>
          <div class="ref__card ref__stack">
            <PfUsageMeter label="Photos this week" :used="7" :limit="10" resets="Resets on Monday" />
            <PfUsageMeter label="Video this week" :used="9" :limit="9" unit="seconds" resets="Resets on Monday" />
          </div>
        </div>
      </section>

      <!-- ───────────────────────── status ───────────────────────── -->
      <section id="status" class="ref__sec">
        <h2 class="pf-display-m">Status language</h2>
        <p class="pf-body pf-quiet pf-measure">One icon, one word and one colour rule for every job. Only failed is coloured.</p>
        <table class="ref__table pf-small">
          <thead><tr><th>Shown as</th><th>API status</th><th>Colour</th><th>Says</th></tr></thead>
          <tbody>
            <tr><td><PfStatus status="waiting" /></td><td>queued</td><td>ink-2</td><td>Position in line and the server's estimated start</td></tr>
            <tr><td><PfStatus status="making" /></td><td>running</td><td>ink, with the seam sweeping</td><td>Estimated time left, then "Almost there". Never a percentage</td></tr>
            <tr><td><PfStatus status="ready" /></td><td>succeeded</td><td>ink</td><td>Credits used, time taken</td></tr>
            <tr><td><PfStatus status="failed" /></td><td>failed</td><td>danger</td><td>What happened, that no credit was used, "Try again"</td></tr>
            <tr><td><PfStatus status="cancelled" /></td><td>cancelled</td><td>ink-2</td><td>Nothing more</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ───────────────────────── motion ───────────────────────── -->
      <section id="motion" class="ref__sec">
        <h2 class="pf-display-m">Motion</h2>
        <p class="pf-body pf-quiet pf-measure">Motion answers the person. The only motion nobody asked for is the seam sweep while a result develops.</p>
        <table class="ref__table pf-small">
          <thead><tr><th>What moves</th><th>Duration</th><th>Easing</th><th>Reduced motion</th></tr></thead>
          <tbody><tr v-for="m in motion" :key="m[0]"><td v-for="c in m" :key="c">{{ c }}</td></tr></tbody>
        </table>
      </section>

      <!-- ───────────────────────── darkroom ───────────────────────── -->
      <section id="darkroom" class="ref__sec">
        <h2 class="pf-display-m">Darkroom</h2>
        <p class="pf-body pf-quiet pf-measure">The editor's surround has its own switch, because some photos are judged better on dark. It does not follow the system.</p>
        <div class="ref__themes">
          <div v-for="theme in ['day', 'darkroom']" :key="theme" :data-pf-theme="theme" class="ref__theme ref__theme--canvas">
            <PfPrint v-bind="photos[7]!" />
            <div class="ref__states">
              <PfButton variant="primary">Enhance photo</PfButton><PfButton>Try again</PfButton><PfStatus status="failed" />
              <span class="pf-small pf-quiet">Secondary text</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ───────────────────────── do / don't ───────────────────────── -->
      <section id="dodont" class="ref__sec">
        <h2 class="pf-display-m">Do and don't</h2>
        <div class="ref__dd">
          <div>
            <p class="pf-label">Do: the contact sheet</p>
            <PfContactSheet :items="photos.slice(0, 5)" :row-height="110" :row-height-narrow="80" :max-rows="2" />
          </div>
          <div>
            <p class="pf-label ref__dont">Don't: a grid of rounded cards that crops people's pictures</p>
            <div class="ref__cards"><img v-for="p in photos.slice(0, 6)" :key="p.id" :src="p.src" alt=""></div>
          </div>
          <div>
            <p class="pf-label">Do: neutral ground, the photo is the colour</p>
            <div class="ref__ground"><PfPrint v-bind="photos[0]!" /></div>
          </div>
          <div>
            <p class="pf-label ref__dont">Don't: a gradient hero that tints the photo's surroundings</p>
            <div class="ref__ground ref__ground--grad"><PfPrint v-bind="photos[0]!" /></div>
          </div>
          <div>
            <p class="pf-label">Do: the queue line the server can stand behind</p>
            <div class="ref__card"><p class="pf-label pf-num">3rd in line, starts in about 40 s</p></div>
          </div>
          <div>
            <p class="pf-label ref__dont">Don't: a percentage nobody measured</p>
            <div class="ref__card"><div class="ref__fake"><i /></div><p class="pf-small pf-num">67%</p></div>
          </div>
        </div>
      </section>
    </main>

    <PfSheet v-model:open="sheetOpen" title="Post to feed">
      <div class="ref__stack">
        <PfPrint v-bind="photos[7]!" />
        <PfTextarea label="Caption" placeholder="Optional" />
        <PfSwitch :model-value="true" label="Show the original" />
        <PfSwitch :model-value="true" label="Allow remixes" />
      </div>
      <template #footer><PfButton variant="primary" block @click="sheetOpen = false; toast.show('Posted', { action: { label: 'View', run: () => {} } })">Post</PfButton></template>
    </PfSheet>
    <PfDialog v-model:open="dialogOpen" title="Delete 3 photos?" text="Removes 3 photos and the 7 results made from them. Posts stay until you delete them.">
      <template #actions="{ close }">
        <PfButton data-autofocus @click="close">Keep them</PfButton>
        <PfButton variant="destructive" @click="close(); toast.show('Deleted 3 photos', { action: { label: 'Undo', run: () => {} } })">Delete 3 photos</PfButton>
      </template>
    </PfDialog>
    <PfPaywallSheet v-model:open="paywallOpen" :plans="plans" resets="Your photos reset on Monday." note="Placeholder numbers." @choose="paywallOpen = false" />
    <span class="pf-sr">{{ t('ref.end', 'End of reference') }}</span>
  </div>
</template>

<style scoped>
.ref {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.ref__nav {
  display: grid;
  gap: var(--pf-3);
  padding: var(--pf-5) var(--pf-4);
  background: var(--pf-paper);
  border-bottom: var(--pf-hair) solid var(--pf-line);
}
.ref__nav nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pf-1) var(--pf-4);
}
.ref__nav a {
  color: var(--pf-ink);
  text-decoration: none;
  padding: var(--pf-1) 0;
}
.ref__nav a:hover { text-decoration: underline; }
.ref__nav p { margin: 0; }
.ref__main {
  min-width: 0;
  padding: var(--pf-6) var(--pf-4) var(--pf-24);
  display: grid;
  gap: var(--pf-16);
  max-width: var(--pf-page);
}
.ref__intro { display: grid; gap: var(--pf-4); }
.ref__sec { display: grid; gap: var(--pf-5); scroll-margin-top: var(--pf-4); min-width: 0; }
.ref__sec > h3 { margin-top: var(--pf-5); }
.ref__sec figure { margin: 0; display: grid; gap: var(--pf-2); align-content: start; }
.ref__themes, .ref__grid2 { display: grid; gap: var(--pf-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); }
.ref__grid3 { display: grid; gap: var(--pf-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); align-items: start; }
.ref__theme { padding: var(--pf-4); background: var(--pf-table); box-shadow: 0 0 0 var(--pf-hair) var(--pf-line); display: grid; gap: var(--pf-3); }
.ref__theme--canvas { padding: var(--pf-8); }
.ref__theme p { margin: 0; }
.ref__swatches { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--pf-2); grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); }
.ref__swatches li { display: flex; gap: var(--pf-2); align-items: center; }
.ref__swatch { width: var(--pf-10); height: var(--pf-10); flex: none; box-shadow: 0 0 0 var(--pf-hair) var(--pf-line-strong); }
.ref__table { border-collapse: collapse; width: 100%; background: var(--pf-paper); }
.ref__table caption { text-align: start; padding-bottom: var(--pf-2); }
.ref__table th, .ref__table td { text-align: start; padding: var(--pf-2) var(--pf-3); border-bottom: var(--pf-hair) solid var(--pf-line); vertical-align: top; }
.ref__table th { font-weight: var(--pf-w-strong); }
.ref__flare { display: grid; gap: var(--pf-2); padding: var(--pf-5); background: var(--pf-paper); }
.ref__flare p { margin: 0; font-size: var(--pf-t-display-xl); line-height: 1.05; font-weight: var(--pf-w-display); letter-spacing: var(--pf-track-display); }
.ref__flare span { letter-spacing: 0; font-variation-settings: 'FLAR' 0; }
.ref__flare-0 { font-variation-settings: 'FLAR' 0, 'VOLM' 0; }
.ref__flare-100 { font-variation-settings: 'FLAR' 100, 'VOLM' 0; }
.ref__scale { display: grid; gap: var(--pf-4); }
.ref__scale-row { display: grid; gap: var(--pf-1); padding-bottom: var(--pf-3); border-bottom: var(--pf-hair) solid var(--pf-line); }
.ref__scale-row p { margin: 0; }
.ref__langs { display: grid; gap: var(--pf-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); }
.ref__lang { display: grid; gap: var(--pf-2); align-content: start; justify-items: start; padding: var(--pf-4); background: var(--pf-paper); }
.ref__lang p { margin: 0; }
.ref__row, .ref__states { display: flex; flex-wrap: wrap; gap: var(--pf-4); align-items: flex-end; }
.ref__states p { margin: 0 0 var(--pf-1); }
.ref__spaces { display: flex; align-items: flex-end; gap: var(--pf-3); }
.ref__spaces span { display: grid; justify-items: center; gap: var(--pf-1); }
.ref__spaces i { background: var(--pf-ink); display: block; }
.ref__shape { display: grid; place-items: center; width: var(--pf-24); height: var(--pf-16); padding: var(--pf-2); background: var(--pf-paper); box-shadow: 0 0 0 var(--pf-hair) var(--pf-line-strong); text-align: center; }
.ref__shape--lift { box-shadow: var(--pf-lift); }
.ref__logos { justify-items: start; gap: var(--pf-5) !important; padding: var(--pf-5); background: var(--pf-paper); }
.ref__phone { max-width: 22rem; display: grid; gap: var(--pf-2); }
.ref__phone p { margin: 0; }
.ref__chips { display: flex; flex-wrap: wrap; gap: var(--pf-2); }
.ref__stack { display: grid; gap: var(--pf-4); align-content: start; min-width: 0; }
.ref__prints { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: var(--pf-4); align-items: start; }
.ref__card { padding: var(--pf-5); background: var(--pf-paper); box-shadow: 0 0 0 var(--pf-hair) var(--pf-line); min-width: 0; }
.ref__frame { background: var(--pf-table); box-shadow: 0 0 0 var(--pf-hair) var(--pf-line-strong); overflow: hidden; min-width: 0; }
.ref__frame--rail { display: flex; height: 30rem; }
.ref__frame--phone { display: flex; flex-direction: column; height: 30rem; max-width: 24.375rem; }
.ref__framebody { flex: 1; min-width: 0; }
.ref__dd { display: grid; gap: var(--pf-6) var(--pf-5); grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); align-items: start; }
.ref__dd > div { display: grid; gap: var(--pf-2); min-width: 0; }
.ref__dd p { margin: 0; }
.ref__dont { color: var(--pf-danger); }
.ref__cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--pf-3); }
.ref__cards img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--pf-r-sheet); box-shadow: var(--pf-lift); }
.ref__ground { padding: var(--pf-8); background: var(--pf-table); box-shadow: 0 0 0 var(--pf-hair) var(--pf-line); }
.ref__ground--grad { background: linear-gradient(135deg, var(--pf-blue), var(--pf-danger)); }
.ref__fake { height: var(--pf-2); background: var(--pf-well); border-radius: var(--pf-r-round); overflow: hidden; }
.ref__fake i { display: block; width: 67%; height: 100%; background: var(--pf-blue); }
code { font-family: var(--pf-mono); font-size: 0.9em; }

@media (min-width: 900px) {
  .ref { grid-template-columns: 15rem minmax(0, 1fr); }
  .ref__nav { position: sticky; top: 0; height: 100dvh; box-sizing: border-box; align-content: start; border-bottom: 0; border-inline-end: var(--pf-hair) solid var(--pf-line); }
  .ref__nav nav { display: grid; gap: var(--pf-0h); margin-top: var(--pf-4); }
  .ref__main { padding: var(--pf-12) var(--pf-12) var(--pf-24); }
}
</style>
