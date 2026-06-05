import { pgEnum, pgTable, uuid, text } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('contact_status', ['active', 'inactive'])

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  status: statusEnum('status').notNull()
})
