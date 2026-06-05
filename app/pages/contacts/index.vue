<script setup lang="ts">
const { contacts, fetchContacts, deleteContact } = useContacts()
const toast = useToast()
await fetchContacts()

const search = ref('')

const filtered = computed(() => {
  if (!search.value) return contacts.value
  const q = search.value.toLowerCase()
  return contacts.value.filter(
    (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  )
})

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

const isDeleteOpen = ref(false)
const deleteId = ref<string | null>(null)

function openDelete(id: string) {
  deleteId.value = id
  isDeleteOpen.value = true
}

function rowActions(id: string) {
  return [
    [{ label: 'Edit', icon: 'i-lucide-pencil', to: `/contacts/${id}/edit` }],
    [
      {
        label: 'Delete',
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect: () => openDelete(id)
      }
    ]
  ]
}

async function handleDelete() {
  if (!deleteId.value) return
  try {
    await deleteContact(deleteId.value)
    toast.add({ title: 'Contact deleted', color: 'success' })
  } catch (e) {
    const message =
      (e as { data?: { message?: string } }).data?.message ?? 'Failed to delete contact'
    toast.add({ title: message, color: 'error' })
    throw e
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Contacts</h1>
    </div>

    <div class="flex justify-between mb-4">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search contacts..."
        class="w-1/2"
      />
      <UButton to="/contacts/create" icon="i-lucide-plus" label="New Contact" />
    </div>

    <UCard>
      <UTable :data="filtered" :columns="columns">
        <template #status-cell="{ row }">
          <UBadge :color="statusColor[row.original.status]" variant="subtle" class="capitalize">
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex justify-end">
            <UDropdownMenu :items="rowActions(row.original.id)">
              <UButton
                icon="i-lucide-ellipsis-vertical"
                size="md"
                color="neutral"
                variant="ghost"
              />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </UCard>

    <DeleteModal v-model:open="isDeleteOpen" title="Delete Contact" :on-delete="handleDelete" />
  </UContainer>
</template>
