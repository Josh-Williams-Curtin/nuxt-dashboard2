import { eq } from 'drizzle-orm'
import { db } from '~~/server/db/index'
import { contacts } from '~~/server/db/schema'
import type { Contact } from '~~/shared/types/contact'

export async function getContacts(): Promise<Contact[]> {
  return db.select().from(contacts)
}

export async function getContact(id: string): Promise<Contact | null> {
  const rows = await db.select().from(contacts).where(eq(contacts.id, id))
  return rows[0] ?? null
}

export async function createContact(data: Omit<Contact, 'id'>): Promise<Contact> {
  const rows = await db.insert(contacts).values(data).returning()
  return rows[0]!
}

export async function updateContact(id: string, data: Omit<Contact, 'id'>): Promise<Contact | null> {
  const rows = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning()
  return rows[0] ?? null
}

export async function deleteContact(id: string): Promise<boolean> {
  const rows = await db.delete(contacts).where(eq(contacts.id, id)).returning({ id: contacts.id })
  return rows.length > 0
}
