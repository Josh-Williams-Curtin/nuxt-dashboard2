<script setup lang="ts">
import type { PillarTreeItem } from '~~/shared/types/pillar'

const childLabels: Record<string, string> = {
  pillar: 'Building Block',
  buildingBlock: 'Construct',
  construct: 'Subconstruct'
}

const props = defineProps<{
  parent: PillarTreeItem
  onSave: (data: PillarItemCreateSchema) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })
const title = computed(() => `Add ${childLabels[props.parent.type]}`)
const state = reactive<Partial<PillarItemCreateSchema>>({ symbol: '', name: '', order: 1 })

watch(open, (val) => {
  if (val) Object.assign(state, { symbol: '', name: '', order: 1 })
})
</script>

<template>
  <FormModal v-model:open="open" :title="title" :schema="pillarItemCreateSchema" :state="state" :on-save="onSave">
    <div class="grid grid-cols-2 gap-3">
      <UFormField name="symbol" label="Symbol">
        <UInput v-model="state.symbol" autofocus class="w-full" />
      </UFormField>
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" class="w-full" />
      </UFormField>
      <UFormField name="order" label="Sort Order">
        <UInput v-model.number="state.order" type="number" min="1" class="w-full" />
      </UFormField>
    </div>
  </FormModal>
</template>
