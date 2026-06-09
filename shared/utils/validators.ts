import * as z from 'zod'
import { CONTACT_STATUSES } from '../types/contact'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  phone: z.string(),
  status: z.enum(CONTACT_STATUSES)
})

export type ContactSchema = z.output<typeof contactSchema>

export const pillarItemCreateSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Name is required'),
  order: z.number().min(1, 'Order must be at least 1')
})

export type PillarItemCreateSchema = z.output<typeof pillarItemCreateSchema>

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

export type LoginSchema = z.output<typeof loginSchema>
