import { eq } from 'drizzle-orm'
import { db } from '~~/server/db/index'
import { users } from '~~/server/db/schema'

export async function getUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email))
  return rows[0] ?? null
}
