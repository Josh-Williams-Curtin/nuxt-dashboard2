import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const client = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 1
})

const db = drizzle(client)

try {
  await migrate(db, { migrationsFolder: './server/db/migrations' })
  console.log('Migration complete')
}
catch (e) {
  console.error('Migration failed:', e)
}
finally {
  await client.end()
}
