<script setup lang="ts">
const { contacts, fetchContacts, deleteContact } = useContacts()
const toast = useToast()
await fetchContacts()

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const isDeleteOpen = ref(false)
const deleteId = ref<number | null>(null)
const deleting = ref(false)

function openDeleteModal(id: number) {
  deleteId.value = id
  isDeleteOpen.value = true
}

async function confirmDelete() {
  if (!deleteId.value) return
  deleting.value = true
  try {
    await deleteContact(deleteId.value)
    toast.add({ title: 'Contact deleted', color: 'success' })
    isDeleteOpen.value = false
  } catch (e) {
    const message = (e as { data?: { message?: string } }).data?.message ?? 'Failed to delete contact'
    toast.add({ title: message, color: 'error' })
  } finally {
    deleting.value = false
    deleteId.value = null
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Contacts</h1>
      <UButton to="/contacts/create" icon="i-lucide-plus" label="New Contact" />
    </div>

    <UCard>
      <UTable :data="contacts" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge
            :color="row.original.status === 'active' ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-1 justify-end">
            <UButton
              :to="`/contacts/${row.original.id}/edit`"
              icon="i-lucide-pencil"
              size="xs"
              color="neutral"
              variant="ghost"
              aria-label="Edit"
            />
            <UButton
              icon="i-lucide-trash-2"
              size="xs"
              color="error"
              variant="ghost"
              aria-label="Delete"
              @click="openDeleteModal(row.original.id)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model:open="isDeleteOpen" title="Delete Contact" description="Are you sure? This cannot be undone.">
      <template #footer>
        <UButton label="Cancel" color="neutral" variant="ghost" @click="isDeleteOpen = false" />
        <UButton label="Delete" color="error" :loading="deleting" @click="confirmDelete" />
      </template>
    </UModal>
  </UContainer>
</template>
