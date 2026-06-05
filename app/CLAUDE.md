# CLAUDE.md — Frontend

This file provides guidance to Claude Code when working in the `app/` directory. Inherits root CLAUDE.md.

## Auto-imports

Nuxt auto-imports everything in `app/composables/` and `app/components/` — no runtime import needed. TypeScript types still require an explicit `import type`.

```ts
// runtime — no import needed
const { contacts } = useContacts()

// types — explicit import required
import type { Contact } from '~/composables/useContacts'
```

## Component library

Nuxt UI v4 (`@nuxt/ui`). All components are prefixed `U`. Icons via Iconify: `i-lucide-*` and `i-simple-icons-*`.

- Separator component is `USeparator`, not `UDivider`
- `UTable` uses TanStack Table — columns: `{ accessorKey, header }` or `{ id, header }`. Custom cell slots: `#[columnId]-cell="{ row }"`, row data at `row.original`
- `USelect` uses `:items` prop (array of `{ label, value }`) with `value-key="value"`

## Composables pattern

- `useState` for shared reactive state across pages
- `useFetch` for SSR data loading directly in pages/components
- `$fetch` for mutations (create, update, delete) inside composable functions
- Do not call `useFetch` inside composable functions — only in components or pages

## CRUD pattern

Each entity follows this structure:

- `app/composables/use{Entity}.ts` — state + all `$fetch` calls, exports the TypeScript interface
- `app/components/{Entity}Form.vue` — shared form for create and edit, accepts `initialData` prop, emits `submit`
- `app/pages/{entity}/index.vue` — list, calls composable
- `app/pages/{entity}/create.vue` — calls composable `create` method
- `app/pages/{entity}/[id]/edit.vue` — uses `useFetch` for single record, calls composable `update` method
