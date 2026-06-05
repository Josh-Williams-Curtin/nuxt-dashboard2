import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import * as schema from './schema'
import { seed as seedContacts } from './seeds/contacts'
import { seed as seedPillars } from './seeds/pillars'
import { seed as seedBuildingBlocks } from './seeds/buildingBlocks'
import { seed as seedConstructs } from './seeds/constructs'
import { seed as seedSubconstructs } from './seeds/subconstructs'

const client = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 1
})

const db = drizzle(client, { schema })

console.log('Starting Migrations...')
await client`DROP TABLE IF EXISTS subconstruct CASCADE`
await client`DROP TABLE IF EXISTS construct CASCADE`
await client`DROP TABLE IF EXISTS building_block CASCADE`
await client`DROP TABLE IF EXISTS pillar CASCADE`
await client`DROP TABLE IF EXISTS contacts CASCADE`
await client`DROP TYPE IF EXISTS contact_status`
await client`DROP SCHEMA IF EXISTS drizzle CASCADE`
console.log('Dropped existing schema')

await migrate(db, { migrationsFolder: './server/db/migrations' })
console.log('Migrations finished.')

console.log('Starting Seeding...')
await seedContacts(db)
await seedPillars(db)
await seedBuildingBlocks(db)
await seedConstructs(db)
await seedSubconstructs(db)
console.log('Seeding finished.')

await client.end()
