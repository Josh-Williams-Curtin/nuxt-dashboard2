import * as z from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  phone: z.string(),
  status: z.enum(['active', 'inactive'])
})

export type ContactSchema = z.output<typeof contactSchema>
