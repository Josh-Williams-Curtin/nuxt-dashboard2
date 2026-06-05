import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { constructs } from './construct'

export const subconstructs = pgTable('subconstructs', {
  symbol:          varchar('symbol',           { length: 100 }).primaryKey(),
  name:            varchar('name',             { length: 100 }).notNull(),
  order:           integer('order').notNull().default(0),
  constructSymbol: varchar('construct_symbol', { length: 100 }).notNull()
    .references(() => constructs.symbol, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const subconstructRelations = relations(subconstructs, ({ one }) => ({
  construct: one(constructs, { fields: [subconstructs.constructSymbol], references: [constructs.symbol] }),
}))
