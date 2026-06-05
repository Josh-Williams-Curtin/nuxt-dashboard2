<script setup lang="ts">
const { createContact } = useContacts()
const router = useRouter()

const loading = ref(false)
const error = ref('')

async function onSubmit(data: Parameters<typeof createContact>[0]) {
  loading.value = true
  error.value = ''
  try {
    await createContact(data)
    router.push('/contacts')
  } catch {
    error.value = 'Failed to create contact.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-lg">
    <div class="flex items-center gap-4 mb-6">
      <UButton to="/contacts" icon="i-lucide-arrow-left" variant="ghost" color="neutral" />
      <h1 class="text-2xl font-bold">New Contact</h1>
    </div>

    <UCard>
      <ContactForm
        submit-label="Create Contact"
        :loading="loading"
        :error="error"
        @submit="onSubmit"
      />
    </UCard>
  </UContainer>
</template>
