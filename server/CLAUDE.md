# CLAUDE.md — Backend

This file provides guidance to Claude Code when working in the `server/` directory. Inherits root CLAUDE.md.

## Path alias

Always use `~~` in server files, not `~`. `~` resolves to `app/`, so it will silently fail to find anything under `server/`.

```ts
// correct
import { getContacts } from '~~/server/services/contactsService'

// wrong — ~ resolves to app/, not project root
import { getContacts } from '~/server/services/contactsService'
```

## API route conventions

Files in `server/api/` are auto-registered by Nitro. HTTP method comes from the file suffix:

```
server/api/contacts/
  index.get.ts      → GET    /api/contacts
  index.post.ts     → POST   /api/contacts
  [id].get.ts       → GET    /api/contacts/:id
  [id].put.ts       → PUT    /api/contacts/:id
  [id].delete.ts    → DELETE /api/contacts/:id
```

Route handlers should be thin: read params/body, call a service function, return the result.

## Service layer

Business logic and data access live in `server/services/`. One file per entity, named `{entity}Service.ts`.

Routes import from services. Services do not import from routes.

## Database

Drizzle ORM with PostgreSQL. Connection config comes from env vars (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

Import the `db` instance and `Db` type from `~~/server/db/index.ts`:

```ts
import { db } from '~~/server/db/index'
import type { Db } from '~~/server/db/index'
```

### Naming conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Schema/seed file | camelCase, plural | `buildingBlocks.ts` |
| Table name | snake_case, plural | `building_blocks` |

### Schema

One file per entity under `server/db/schemas/`. All schemas are re-exported from the barrel `server/db/schema.ts` — **always import from `schema.ts`, never directly from individual schema files**.

```
server/db/schemas/
  contact.ts         ← contacts table + statusEnum
  pillar.ts          ← pillars table + relations
  buildingBlocks.ts  ← building_block table + relations
  construct.ts       ← construct table + relations
  subconstruct.ts    ← subconstruct table + relations

server/db/schema.ts  ← re-exports everything above
```

When adding a new table:
1. Create `server/db/schemas/{entity}.ts`
2. Add `export * from './schemas/{entity}'` to `server/db/schema.ts`
3. Run `bun run db:generate` then `bun run db:migrate`

### Seed data

**Every table must have a seed file.** `bun run db:seed` should always produce a fully working app state. Seed data also serves as living documentation of the schema.

One file per entity under `server/db/seeds/`, each exporting a `seed(db: Db)` function. The orchestrator `server/db/seed.ts` drops all tables, runs migrations, then calls each seed in dependency order (parents before children).

```
server/db/seeds/
  contacts.ts
  pillars.ts
  buildingBlocks.ts
  constructs.ts
  subconstructs.ts

server/db/seed.ts    ← orchestrates drops + migrations + seed calls
```

Conventions:
- Always use `.onConflictDoNothing()` — keeps seeds idempotent
- Insert order in `seed.ts`: parents before children (foreign key order)
- DROP order in `seed.ts`: children before parents (reverse of insert order)

When adding a seed for a new table:
1. Create `server/db/seeds/{entity}.ts` exporting `async function seed(db: Db)`
2. Add `DROP TABLE IF EXISTS {table} CASCADE` to `server/db/seed.ts` in reverse dependency order (before migrations)
3. Import and call the seed function in `server/db/seed.ts` in dependency order (after migrations)

## Adding a new entity (full stack)

1. Create `server/db/schemas/{entity}.ts` and add to `server/db/schema.ts`
2. Create `server/db/seeds/{entity}.ts` and wire into `server/db/seed.ts`
3. Generate and run migrations
4. Create `server/services/{entity}Service.ts` with CRUD functions
5. Create the five route files under `server/api/{entity}/`
6. Create `app/composables/use{Entity}.ts` and `app/components/{Entity}Form.vue`
7. Add pages under `app/pages/{entity}/`
8. Add a nav item to `app/components/AppSidebar.vue`
