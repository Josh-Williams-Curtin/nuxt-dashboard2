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

Nuxt UI v4 (`@nuxt/ui`). All components are prefixed `U`.

Icons via Iconify — three collections are installed:
- `i-lucide-*` — general UI icons (default choice)
- `i-simple-icons-*` — brand/social icons
- `i-logos-*` — company and technology logos (e.g. `i-logos-nuxt-icon`)

Component notes:
- Separator component is `USeparator`, not `UDivider`
- `UTable` uses TanStack Table — columns: `{ accessorKey, header }` or `{ id, header }`. Custom cell slots: `#[columnId]-cell="{ row }"`, row data at `row.original`
- `USelect` uses `:items` prop (array of `{ label, value }`) with `value-key="value"`

## Layout

The app shell lives in `app/app.vue`. It renders `AppSidebar` on the left and a header + `NuxtPage` on the right.

```
app.vue
├── AppSidebar         (app/components/AppSidebar.vue)
└── header + NuxtPage
```

**Sidebar open state** is shared via `useState('sidebarOpen', () => true)`. Both `AppSidebar.vue` and the toggle button in `app.vue` read/write this same key.

**`AppSidebar.vue`** uses `USidebar` with:
- `#header` slot — logo/icon
- default slot — `UNavigationMenu` with `orientation="vertical"`
- `#footer` slot — user dropdown (`UDropdownMenu`)

When adding nav items, edit the `items` array in `AppSidebar.vue`. Use `to` for real routes; omit `to` for placeholder items.

## Composables pattern

- `useState` for shared reactive state across pages
- `useAsyncData` inside composables for list fetches — use `immediate: true` and a `transform` callback to populate the `useState` ref
- `$fetch` for mutations (create, update, delete) inside composable functions, followed by `refresh()` from `useAsyncData`
- Expose `pending` from `useAsyncData` so pages can show loading state without managing it themselves

Example structure for a list composable:

```ts
export const useContacts = () => {
  const contacts = useState<Contact[]>('contacts', () => [])

  const { pending, refresh } = useAsyncData('contacts', () => $fetch<Contact[]>('/api/contacts'), {
    immediate: true,
    transform: (data) => (contacts.value = data)
  })

  const createContact = async (data: Omit<Contact, 'id'>) => {
    await $fetch('/api/contacts', { method: 'POST', body: data })
    await refresh()
  }

  return { contacts, pending, createContact }
}
```

## CRUD pattern

Each entity follows this structure:

- `app/composables/use{Entity}.ts` — state + `useAsyncData` list fetch + `$fetch` mutations with `refresh()`
- `app/components/{Entity}Form.vue` — shared form for create and edit, accepts `initialData` prop, emits `submit`
- `app/pages/{entity}/index.vue` — list, calls composable, uses `pending` for loading state
- `app/pages/{entity}/create.vue` — calls composable `create` method
- `app/pages/{entity}/[id]/edit.vue` — uses `useFetch` for single record, calls composable `update` method
