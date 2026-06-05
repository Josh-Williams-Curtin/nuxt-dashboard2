import bcrypt from 'bcryptjs'
import { users } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(users).values([{
    email: 'admin@example.com',
    name: 'Admin',
    passwordHash: bcrypt.hashSync('password123', 10)
  }]).onConflictDoNothing()
  console.log('  seeded: users')
}
