import { constructs } from '../schema'
import type { Db } from '../index'

export async function seed(db: Db) {
  await db.insert(constructs).values([
    { symbol: 'OBJECTIVES',    name: 'Objectives',          order: 1, buildingBlockSymbol: 'VISION' },
    { symbol: 'KPI',           name: 'KPIs',                order: 2, buildingBlockSymbol: 'VISION' },
    { symbol: 'INITIATIVES',   name: 'Initiatives',         order: 1, buildingBlockSymbol: 'ROADMAP' },
    { symbol: 'MILESTONES',    name: 'Milestones',          order: 2, buildingBlockSymbol: 'ROADMAP' },
    { symbol: 'RECRUITMENT',   name: 'Recruitment',         order: 1, buildingBlockSymbol: 'TALENT' },
    { symbol: 'DEVELOPMENT',   name: 'Development',         order: 2, buildingBlockSymbol: 'TALENT' },
    { symbol: 'VALUES',        name: 'Values',              order: 1, buildingBlockSymbol: 'CULTURE' },
    { symbol: 'ENGAGEMENT',    name: 'Engagement',          order: 2, buildingBlockSymbol: 'CULTURE' },
    { symbol: 'POLICIES',      name: 'Policies',            order: 1, buildingBlockSymbol: 'GOVERNANCE' },
    { symbol: 'COMPLIANCE',    name: 'Compliance',          order: 2, buildingBlockSymbol: 'GOVERNANCE' },
    { symbol: 'WORKFLOWS',     name: 'Workflows',           order: 1, buildingBlockSymbol: 'OPERATIONS' },
    { symbol: 'METRICS',       name: 'Metrics',             order: 2, buildingBlockSymbol: 'OPERATIONS' },
    { symbol: 'CLOUD',         name: 'Cloud',               order: 1, buildingBlockSymbol: 'INFRASTRUCTURE' },
    { symbol: 'SECURITY',      name: 'Security',            order: 2, buildingBlockSymbol: 'INFRASTRUCTURE' },
    { symbol: 'DATA',          name: 'Data',                order: 1, buildingBlockSymbol: 'PLATFORMS' },
    { symbol: 'INTEGRATIONS',  name: 'Integrations',        order: 2, buildingBlockSymbol: 'PLATFORMS' },
  ]).onConflictDoNothing()
  console.log('  seeded: constructs')
}
