<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  onDelete: () => Promise<void>
}>(), {
  title: 'Delete',
  description: 'Are you sure? This action cannot be undone.'
})

const open = defineModel<boolean>('open', { default: false })

async function onSubmit() {
  try {
    await props.onDelete()
    open.value = false
  } catch {
    // onDelete handles its own error feedback — modal stays open
  }
}
</script>

<template>
  <span v-if="$slots.default" @click="open = true">
    <slot />
  </span>

  <UModal v-model:open="open" :title="title" :description="description">
    <template #body>
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
        <UButton label="Delete" color="error" variant="solid" loading-auto @click="onSubmit" />
      </div>
    </template>
  </UModal>
</template>
