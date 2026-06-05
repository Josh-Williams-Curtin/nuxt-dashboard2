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

When swapping to a real database (Drizzle, Prisma, etc.), only the service files change.

## Adding a new entity

1. Create `server/services/{entity}Service.ts` with CRUD functions and the TypeScript interface
2. Create the five route files under `server/api/{entity}/`
3. Create `app/composables/use{Entity}.ts` and `app/components/{Entity}Form.vue`
4. Add pages under `app/pages/{entity}/`
