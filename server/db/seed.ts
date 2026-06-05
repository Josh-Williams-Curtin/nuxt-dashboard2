import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import { seed as seedContacts } from './seeds/contacts'

const client = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 1
})

const db = drizzle(client, { schema })

await seedContacts(db)

await client.end()
