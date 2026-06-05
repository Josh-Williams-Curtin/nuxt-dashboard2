import { pillars } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(pillars).values([
    { symbol: 'STRATEGY',    name: 'Strategy',    order: 1 },
    { symbol: 'PEOPLE',      name: 'People',      order: 2 },
    { symbol: 'PROCESS',     name: 'Process',     order: 3 },
    { symbol: 'TECHNOLOGY',  name: 'Technology',  order: 4 },
  ]).onConflictDoNothing()
  console.log('  seeded: pillars')
}
