import { buildingBlocks } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(buildingBlocks).values([
    { symbol: 'VISION',       name: 'Vision & Goals',       order: 1, pillarSymbol: 'STRATEGY' },
    { symbol: 'ROADMAP',      name: 'Roadmap',              order: 2, pillarSymbol: 'STRATEGY' },
    { symbol: 'TALENT',       name: 'Talent',               order: 1, pillarSymbol: 'PEOPLE' },
    { symbol: 'CULTURE',      name: 'Culture',              order: 2, pillarSymbol: 'PEOPLE' },
    { symbol: 'GOVERNANCE',   name: 'Governance',           order: 1, pillarSymbol: 'PROCESS' },
    { symbol: 'OPERATIONS',   name: 'Operations',           order: 2, pillarSymbol: 'PROCESS' },
    { symbol: 'INFRASTRUCTURE', name: 'Infrastructure',     order: 1, pillarSymbol: 'TECHNOLOGY' },
    { symbol: 'PLATFORMS',    name: 'Platforms',            order: 2, pillarSymbol: 'TECHNOLOGY' },
  ]).onConflictDoNothing()
  console.log('  seeded: building blocks')
}
