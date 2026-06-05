<script setup lang="ts">
const { contacts, fetchContacts, deleteContact } = useContacts()
await fetchContacts()

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

async function remove(id: number) {
  if (!confirm('Delete this contact?')) return
  await deleteContact(id)
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
              @click="remove(row.original.id)"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>
