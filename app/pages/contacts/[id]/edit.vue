<script setup lang="ts">
import type { Contact } from '~/composables/useContacts'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { data: contact } = await useFetch<Contact>(`/api/contacts/${id}`)
const { updateContact } = useContacts()

const loading = ref(false)
const error = ref('')

async function onSubmit(data: Omit<Contact, 'id'>) {
  loading.value = true
  error.value = ''
  try {
    await updateContact(id, data)
    router.push('/contacts')
  } catch {
    error.value = 'Failed to update contact.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-lg">
    <div class="flex items-center gap-4 mb-6">
      <UButton to="/contacts" icon="i-lucide-arrow-left" variant="ghost" color="neutral" />
      <h1 class="text-2xl font-bold">Edit Contact</h1>
    </div>

    <UCard>
      <ContactForm
        :initial-data="contact ?? undefined"
        submit-label="Update Contact"
        :loading="loading"
        :error="error"
        @submit="onSubmit"
      />
    </UCard>
  </UContainer>
</template>
