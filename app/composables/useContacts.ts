export const useContacts = () => {
  const contacts = useState<Contact[]>('contacts', () => [])

  const { pending, refresh } = useAsyncData('contacts', () => $fetch<Contact[]>('/api/contacts'), {
    immediate: true,
    transform: (data) => (contacts.value = data)
  })

  const createContact = async (data: Omit<Contact, 'id'>) => {
    await $fetch('/api/contacts', { method: 'POST', body: data })
    await refresh()
  }

  const updateContact = async (id: string, data: Omit<Contact, 'id'>) => {
    await $fetch(`/api/contacts/${id}`, { method: 'PUT', body: data })
    await refresh()
  }

  const deleteContact = async (id: string) => {
    await $fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    await refresh()
  }

  const fetchContact = (id: string) => $fetch<Contact>(`/api/contacts/${id}`)

  return { contacts, pending, fetchContact, createContact, updateContact, deleteContact }
}
