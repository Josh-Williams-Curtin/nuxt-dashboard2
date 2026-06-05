export const CONTACT_STATUSES = ['active', 'inactive'] as const
export type ContactStatus = typeof CONTACT_STATUSES[number]

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  status: ContactStatus
}

export const defaultContact: Omit<Contact, 'id'> = {
  name: '',
  email: '',
  phone: '',
  status: 'active'
}

export const statusColor = {
  active: 'success',
  inactive: 'error'
} as const satisfies Record<ContactStatus, string>
