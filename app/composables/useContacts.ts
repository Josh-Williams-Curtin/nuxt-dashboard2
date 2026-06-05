export const useContacts = () => {
  const contacts = useState<Contact[]>('contacts', () => [])

  const fetchContacts = async () => {
    contacts.value = await $fetch<Contact[]>('/api/contacts')
  }

  const createContact = async (data: Omit<Contact, 'id'>) => {
    await $fetch('/api/contacts', { method: 'POST', body: data })
    await fetchContacts()
  }

  const updateContact = async (id: string, data: Omit<Contact, 'id'>) => {
    await $fetch(`/api/contacts/${id}`, { method: 'PUT', body: data })
    await fetchContacts()
  }

  const deleteContact = async (id: string) => {
    await $fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    await fetchContacts()
  }

  const fetchContact = (id: string) => $fetch<Contact>(`/api/contacts/${id}`)

  return { contacts, fetchContacts, fetchContact, createContact, updateContact, deleteContact }
}
