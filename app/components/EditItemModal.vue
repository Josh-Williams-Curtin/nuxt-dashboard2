<script setup lang="ts">
const props = defineProps<{
  symbol: string
  initialName: string
  initialOrder: number
  onSave: (name: string, order: number) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })
const name = ref(props.initialName)
const order = ref(props.initialOrder)

watch(open, (val) => {
  if (val) {
    name.value = props.initialName
    order.value = props.initialOrder
  }
})

async function onSubmit() {
  try {
    await props.onSave(name.value, order.value)
    open.value = false
  } catch {
    // onSave handles error feedback — modal stays open
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Item">
    <template #body>
      <div class="space-y-3">
        <UFormField label="Symbol">
          <UInput :model-value="symbol" disabled />
        </UFormField>
        <UFormField label="Name">
          <UInput v-model="name" autofocus @keyup.enter="onSubmit" />
        </UFormField>
        <UFormField label="Sort Order">
          <UInput v-model.number="order" type="number" min="1" @keyup.enter="onSubmit" />
        </UFormField>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="Save" color="primary" variant="solid" loading-auto @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
