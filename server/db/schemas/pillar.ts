import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { buildingBlocks } from './buildingBlocks'

export const pillars = pgTable('pillars', {
  symbol: varchar('symbol', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  order: integer('order').notNull().default(0)
})

export const pillarRelations = relations(pillars, ({ many }) => ({
  buildingBlocks: many(buildingBlocks)
}))
