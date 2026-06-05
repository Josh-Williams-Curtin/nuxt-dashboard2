import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { buildingBlocks } from './buildingBlocks'
import { subconstructs } from './subconstruct'

export const constructs = pgTable('construct', {
  symbol: varchar('symbol', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  order: integer('order').notNull().default(0),
  buildingBlockSymbol: varchar('building_block_symbol', { length: 100 })
    .notNull()
    .references(() => buildingBlocks.symbol, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const constructRelations = relations(constructs, ({ one, many }) => ({
  buildingBlock: one(buildingBlocks, {
    fields: [constructs.buildingBlockSymbol],
    references: [buildingBlocks.symbol]
  }),
  subconstructs: many(subconstructs)
}))
