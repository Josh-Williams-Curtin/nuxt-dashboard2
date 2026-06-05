import { subconstructs } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(subconstructs).values([
    { symbol: 'OKR',              name: 'OKRs',                   order: 1, constructSymbol: 'OBJECTIVES' },
    { symbol: 'STRATEGIC_GOALS',  name: 'Strategic Goals',        order: 2, constructSymbol: 'OBJECTIVES' },
    { symbol: 'LEADING_KPI',      name: 'Leading Indicators',     order: 1, constructSymbol: 'KPI' },
    { symbol: 'LAGGING_KPI',      name: 'Lagging Indicators',     order: 2, constructSymbol: 'KPI' },
    { symbol: 'PROGRAMS',         name: 'Programs',               order: 1, constructSymbol: 'INITIATIVES' },
    { symbol: 'PROJECTS',         name: 'Projects',               order: 2, constructSymbol: 'INITIATIVES' },
    { symbol: 'QUARTERLY',        name: 'Quarterly Milestones',   order: 1, constructSymbol: 'MILESTONES' },
    { symbol: 'ANNUAL',           name: 'Annual Milestones',      order: 2, constructSymbol: 'MILESTONES' },
  ]).onConflictDoNothing()
  console.log('  seeded: subconstructs')
}
