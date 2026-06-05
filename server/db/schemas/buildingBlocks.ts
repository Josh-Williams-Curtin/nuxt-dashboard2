import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pillars } from './pillar'
import { constructs } from './construct'

export const buildingBlocks = pgTable('building_block', {
  symbol:       varchar('symbol',        { length: 100 }).primaryKey(),
  name:         varchar('name',          { length: 100 }).notNull(),
  order:        integer('order').notNull().default(0),
  pillarSymbol: varchar('pillar_symbol', { length: 100 }).notNull()
    .references(() => pillars.symbol, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const buildingBlockRelations = relations(buildingBlocks, ({ one, many }) => ({
  pillar:     one(pillars,    { fields: [buildingBlocks.pillarSymbol], references: [pillars.symbol] }),
  constructs: many(constructs),
}))
