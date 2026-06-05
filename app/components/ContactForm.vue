<script setup lang="ts">
import type { Contact } from '~/composables/useContacts'

const props = defineProps<{
  initialData?: Partial<Omit<Contact, 'id'>>
  loading?: boolean
  error?: string
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: Omit<Contact, 'id'>]
}>()

const state = reactive({
  name: props.initialData?.name ?? '',
  email: props.initialData?.email ?? '',
  phone: props.initialData?.phone ?? '',
  status: props.initialData?.status ?? ('active' as const)
})

const validationError = ref('')

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

function onSubmit() {
  if (!state.name || !state.email) {
    validationError.value = 'Name and email are required.'
    return
  }
  validationError.value = ''
  emit('submit', { ...state })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <UAlert v-if="error || validationError" color="error" :description="error || validationError" />

    <UFormField name="name" label="Name" required>
      <UInput v-model="state.name" placeholder="Full name" class="w-full" />
    </UFormField>

    <UFormField name="email" label="Email" required>
      <UInput v-model="state.email" type="email" placeholder="email@example.com" class="w-full" />
    </UFormField>

    <UFormField name="phone" label="Phone">
      <UInput v-model="state.phone" placeholder="555-0100" class="w-full" />
    </UFormField>

    <UFormField name="status" label="Status">
      <USelect v-model="state.status" :items="statusItems" value-key="value" class="w-full" />
    </UFormField>

    <div class="flex gap-2 pt-2">
      <UButton type="submit" :label="submitLabel ?? 'Save'" :loading="loading" />
      <UButton to="/contacts" label="Cancel" color="neutral" variant="ghost" />
    </div>
  </form>
</template>
