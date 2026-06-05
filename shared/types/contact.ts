export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
}

export const defaultContact: Omit<Contact, 'id'> = {
  name: '',
  email: '',
  phone: '',
  status: 'active'
}
