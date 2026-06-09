<script setup lang="ts" generic="T extends Record<string, unknown>">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  title: string
  schema: z.ZodType<T>
  state: Partial<T>
  onSave: (data: T) => Promise<void>
}>()

const open = defineModel<boolean>('open', { default: false })

async function onSubmit(event: FormSubmitEvent<T>) {
  try {
    await props.onSave(event.data)
    open.value = false
  } catch {
    // caller handles error feedback — modal stays open
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="title">
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit">
        <slot />
        <div class="flex justify-end gap-2 mt-4">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
          <UButton type="submit" label="Save" color="primary" variant="solid" loading-auto />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
