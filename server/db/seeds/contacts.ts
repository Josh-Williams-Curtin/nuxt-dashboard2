import { contacts } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(contacts).values([
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', status: 'active' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', status: 'active' },
    { name: 'Carol White', email: 'carol@example.com', phone: '555-0103', status: 'inactive' }
  ]).onConflictDoNothing()
  console.log('  seeded: contacts')
}
