<script setup lang="ts">
/**
 * Out of credits in the middle of something. The sheet keeps the request:
 * it says so, offers the plans, and the parent resumes on `choose`.
 */
export interface PfPaywallPlan { id: string, name: string, price: string, period?: string, features: string[], current?: boolean }
withDefaults(defineProps<{
  title?: string
  text?: string
  plans: PfPaywallPlan[]
  /** "Resets on Monday". */
  resets?: string
  /** False on iPhone when purchases must go through the App Store sheet. */
  canBuy?: boolean
  busy?: string | null
  note?: string
}>(), { canBuy: true })
const open = defineModel<boolean>('open', { default: false })
defineEmits<{ choose: [planId: string], later: [] }>()
const t = useT()
</script>

<template>
  <PfSheet v-model:open="open" :title="title ?? t('paywall.title', 'You\'ve used this week\'s photos')">
    <div class="pf-paywall">
      <p class="pf-body">
        {{ text ?? t('paywall.text', 'Your request is saved. Choose a plan and it starts right away, or come back when your photos reset.') }}
      </p>
      <p v-if="resets" class="pf-label pf-num">{{ resets }}</p>
      <div class="pf-paywall__plans">
        <PfPlanCard
          v-for="p in plans"
          :key="p.id"
          :name="p.name"
          :price="p.price"
          :period="p.period"
          :features="p.features"
          :current="p.current"
        >
          <PfButton
            v-if="!p.current && canBuy"
            variant="primary"
            block
            :loading="busy === p.id"
            @click="$emit('choose', p.id)"
          >
            {{ t('paywall.choose', 'Choose {plan}', { plan: p.name }) }}
          </PfButton>
        </PfPlanCard>
      </div>
      <p v-if="note" class="pf-small pf-quiet">{{ note }}</p>
    </div>
    <template #footer>
      <PfButton variant="ghost" block @click="open = false; $emit('later')">
        {{ t('paywall.later', 'Not now') }}
      </PfButton>
    </template>
  </PfSheet>
</template>

<style scoped>
.pf-paywall {
  display: grid;
  gap: var(--pf-4);
}
.pf-paywall p {
  margin: 0;
}
.pf-paywall__plans {
  display: grid;
  gap: var(--pf-3);
}
</style>
