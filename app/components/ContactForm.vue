<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  id?: number
}>()

const { fetchContact, createContact, updateContact } = useContacts()
const router = useRouter()

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  phone: z.string(),
  status: z.enum(['active', 'inactive'])
})

type Schema = z.output<typeof schema>

const existing = props.id ? await fetchContact(props.id) : null

const state = reactive<Partial<Schema>>({
  name: existing?.name ?? '',
  email: existing?.email ?? '',
  phone: existing?.phone ?? '',
  status: existing?.status ?? 'active'
})

const loading = ref(false)
const error = ref('')

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  error.value = ''
  try {
    if (props.id) {
      await updateContact(props.id, event.data)
    } else {
      await createContact(event.data)
    }
    router.push('/contacts')
  } catch {
    error.value = props.id ? 'Failed to update contact.' : 'Failed to create contact.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-lg">
    <div class="flex items-center gap-4 mb-6">
      <UButton to="/contacts" icon="i-lucide-arrow-left" variant="ghost" color="neutral" />
      <h1 class="text-2xl font-bold">{{ id ? 'Edit Contact' : 'New Contact' }}</h1>
    </div>

    <UCard>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="error" color="error" :description="error" />

        <UFormField name="name" label="Name">
          <UInput v-model="state.name" placeholder="Full name" class="w-full" />
        </UFormField>

        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="email@example.com" class="w-full" />
        </UFormField>

        <UFormField name="phone" label="Phone">
          <UInput v-model="state.phone" placeholder="555-0100" class="w-full" />
        </UFormField>

        <UFormField name="status" label="Status">
          <USelect v-model="state.status" :items="statusItems" value-key="value" class="w-full" />
        </UFormField>

        <div class="flex gap-2 pt-2">
          <UButton type="submit" :label="id ? 'Update Contact' : 'Create Contact'" :loading="loading" />
          <UButton to="/contacts" label="Cancel" color="neutral" variant="ghost" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
