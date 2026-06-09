<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { PillarTreeItem } from '~~/shared/types/pillar'

const props = defineProps<{
  item: PillarTreeItem
  onSave: (data: PillarItemSchema) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })

type Schema = PillarItemSchema

const state = reactive<Partial<PillarTreeItem>>({ ...props.item })

watch(open, (val) => {
  if (val) Object.assign(state, props.item)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await props.onSave(event.data)
    open.value = false
  } catch {
    // onSave handles error feedback — modal stays open
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Tree Item">
    <template #body>
      <UForm :schema="pillarItemSchema" :state="state" @submit="onSubmit">
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
        <div class="flex justify-end gap-2 mt-4">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
          <UButton type="submit" label="Save" color="primary" variant="solid" loading-auto />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
