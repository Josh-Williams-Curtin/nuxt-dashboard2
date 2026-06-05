# CLAUDE.md

Behavioral guidelines for the **nuxt-dashboard** project — a full-stack Nuxt 4 application. Nuxt handles both frontend and backend (API routes, server middleware) via its built-in Nitro server. There is no separate backend service.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

**Comments:** Default to none. Add a comment only when the WHY is non-obvious — a hidden constraint, a workaround for a specific bug, a subtle invariant. Never comment what the code does; well-named identifiers already do that.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Prefer editing existing files over creating new ones.
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Verify Before Reporting Done

**Don't say it's fixed without checking.**

- Run the relevant test or command before claiming success.
- Don't write "this should work" — verify that it does.
- If you genuinely can't verify (e.g., no runtime access), say so explicitly rather than asserting success.
- Type checking and linting passing ≠ feature working. Test the actual behavior.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project Reference

### Commands

```bash
bun run dev        # start dev server
bun run build      # production build
bun run preview    # preview production build
bun run lint       # ESLint
bun run typecheck  # TypeScript check via vue-tsc

bun run db:generate  # generate a new Drizzle migration from schema changes
bun run db:migrate   # apply pending migrations
bun run db:seed      # drop all tables, run migrations, and reseed
```

Package manager is **bun**. Do not use npm, yarn, or pnpm.

### Code style

ESLint enforces: no trailing commas (`commaDangle: 'never'`), 1tbs brace style. Match this in generated code.

### Architecture

Full-stack Nuxt 4 app. No separate backend — Nitro (built into Nuxt) handles both SSR and API routes on the same server.

**Frontend** lives in `app/`. Vue 3 + Nuxt UI v4 + Tailwind CSS v4. File-based routing under `app/pages/`. Composables and components are auto-imported.

**Backend** lives in `server/`. File-based API routing under `server/api/` (Nitro). Business logic and data access in `server/services/` — routes stay thin and import from services.

**Data layer** uses Drizzle ORM with PostgreSQL. Schemas live in `server/db/schemas/` (one file per entity), re-exported from `server/db/schema.ts`. Seed data lives in `server/db/seeds/` (one file per entity), orchestrated by `server/db/seed.ts`.

### Path aliases

| Alias | Resolves to | Use in |
|-------|-------------|--------|
| `~`   | `app/`      | `app/` files |
| `~~`  | project root | `server/` files |

Using `~` inside `server/` is a common mistake — it resolves to `app/`, not the project root.
