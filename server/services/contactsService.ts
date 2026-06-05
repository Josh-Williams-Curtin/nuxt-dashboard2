export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
}

let nextId = 4

const contacts: Contact[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '555-0103', status: 'inactive' }
]

export function getContacts() {
  return contacts
}

export function getContact(id: number) {
  return contacts.find(c => c.id === id) ?? null
}

export function createContact(data: Omit<Contact, 'id'>) {
  const contact = { id: nextId++, ...data }
  contacts.push(contact)
  return contact
}

export function updateContact(id: number, data: Omit<Contact, 'id'>) {
  const index = contacts.findIndex(c => c.id === id)
  if (index === -1) return null
  contacts[index] = { id, ...data }
  return contacts[index]
}

export function deleteContact(id: number) {
  const index = contacts.findIndex(c => c.id === id)
  if (index === -1) return false
  contacts.splice(index, 1)
  return true
}
