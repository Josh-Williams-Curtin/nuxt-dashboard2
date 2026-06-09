<script setup lang="ts">
import type { PillarTreeItem } from '~~/shared/types/pillar'

const props = defineProps<{
  item: PillarTreeItem
  onSave: (data: PillarItemSchema) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })
const state = reactive<Partial<PillarTreeItem>>({ ...props.item })

watch(open, (val) => {
  if (val) Object.assign(state, props.item)
})
</script>

<template>
  <FormModal
    v-model:open="open"
    title="Edit Tree Item"
    :schema="pillarItemSchema"
    :state="state"
    :on-save="onSave"
  >
    <div class="grid grid-cols-2 gap-3">
      <UFormField label="Symbol">
        <UInput :model-value="item.symbol" disabled class="w-full" />
      </UFormField>
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" autofocus class="w-full" />
      </UFormField>
      <UFormField name="order" label="Sort Order">
        <UInput v-model.number="state.order" type="number" min="1" class="w-full" />
      </UFormField>
    </div>
  </FormModal>
</template>
