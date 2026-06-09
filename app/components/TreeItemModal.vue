<script setup lang="ts">
import type { PillarTreeItem } from '~~/shared/types/pillar'

const childLabels: Record<string, string> = {
  pillar: 'Building Block',
  buildingBlock: 'Construct',
  construct: 'Subconstruct',
  subconstruct: 'Subconstruct'
}

const props = defineProps<{
  item?: PillarTreeItem
  id?: string
  onSave: (data: PillarItemCreateSchema) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })

const isEdit = computed(() => !!props.id)

const title = computed(() => {
  if (isEdit.value) return 'Edit Tree Item'
  return props.item ? `Create ${childLabels[props.item.type]}` : 'Create Pillar'
})

const state = reactive<Partial<PillarItemCreateSchema>>({ symbol: '', name: '', order: 1 })

watch(open, (val) => {
  if (!val) return
  if (isEdit.value) {
    Object.assign(state, { symbol: props.id, name: props.item?.name, order: props.item?.order })
  } else {
    Object.assign(state, { symbol: '', name: '', order: 1 })
  }
})
</script>

<template>
  <FormModal
    v-model:open="open"
    :title="title"
    :schema="pillarItemCreateSchema"
    :state="state"
    :on-save="onSave"
  >
    <div class="grid grid-cols-2 gap-3">
      <UFormField v-if="item && (!isEdit || item.parentSymbol)" label="Parent">
        <UInput :model-value="(isEdit || item.type === 'subconstruct') ? item.parentSymbol : item.symbol" disabled class="w-full" />
      </UFormField>
      <UFormField name="symbol" label="Symbol">
        <UInput v-model="state.symbol" :disabled="isEdit" :autofocus="!isEdit" class="w-full" />
      </UFormField>
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" :autofocus="isEdit" class="w-full" />
      </UFormField>
      <UFormField name="order" label="Sort Order">
        <UInput v-model.number="state.order" type="number" min="1" class="w-full" />
      </UFormField>
    </div>
  </FormModal>
</template>
