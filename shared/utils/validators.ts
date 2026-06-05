import * as z from 'zod'
import { CONTACT_STATUSES } from '../types/contact'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  phone: z.string(),
  status: z.enum(CONTACT_STATUSES)
})

export type ContactSchema = z.output<typeof contactSchema>
