import { describe, it, expect, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'

const testPillar = {
  // timestamp suffix avoids symbol collisions if a previous run was interrupted
  symbol: `TEST_PILLAR_${Date.now()}`,
  name: 'Test Pillar',
  order: 99
}

const updatedPillar = {
  name: 'Updated Pillar',
  order: 99
}

describe('Pillars Tree API', async () => {
  await setup({ rootDir: fileURLToPath(new URL('../..', import.meta.url)) })

  /* GET */
  // tree is built from seeded data; at minimum the 4 seed pillars should exist
  it('GET /api/pillars/tree returns an array', async () => {
    const tree = await $fetch<unknown[]>('/api/pillars/tree')
    expect(Array.isArray(tree)).toBe(true)
    expect(tree.length).toBeGreaterThan(0)
  })

  // each node wraps a PillarTreeItem in value; label mirrors value.name
  it('GET /api/pillars/tree nodes have expected shape', async () => {
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const first = tree[0]
    expect(first).toHaveProperty('label')
    expect(first).toHaveProperty('icon')
    expect(first).toHaveProperty('value')
    expect(first).toHaveProperty('children')
    expect(first.value).toHaveProperty('symbol')
    expect(first.value.type).toBe('pillar')
  })

  // confirms the seed ran and produced recognisable data
  it('GET /api/pillars/tree includes seeded pillars', async () => {
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const symbols = tree.map((n) => n.value.symbol)
    expect(symbols).toContain('STRATEGY')
    expect(symbols).toContain('PEOPLE')
  })

  // building blocks should be children of their parent pillar, not top-level nodes
  it('GET /api/pillars/tree nests building blocks under pillars', async () => {
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const strategy = tree.find((n) => n.value.symbol === 'STRATEGY')
    expect(Array.isArray(strategy.children)).toBe(true)
    expect(strategy.children.length).toBeGreaterThan(0)
    expect(strategy.children[0].value.type).toBe('buildingBlock')
  })

  /* CREATE */
  // order 99 places the test pillar last to avoid shifting seed data
  it('POST /api/pillars/item creates a pillar', async () => {
    const result = await $fetch<any>('/api/pillars/item', {
      method: 'POST',
      body: { type: 'pillar', ...testPillar }
    })
    expect(result.symbol).toBe(testPillar.symbol)
    expect(result.name).toBe(testPillar.name)
    expect(typeof result.order).toBe('number')
  })

  // creation should be immediately visible via a subsequent GET
  it('POST /api/pillars/item new pillar appears in tree', async () => {
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const symbols = tree.map((n) => n.value.symbol)
    expect(symbols).toContain(testPillar.symbol)
  })

  /* UPDATE */
  // symbol identifies the target; name and order are both mutable
  it('PATCH /api/pillars/item updates the pillar name', async () => {
    const result = await $fetch<any>('/api/pillars/item', {
      method: 'PATCH',
      body: { type: 'pillar', symbol: testPillar.symbol, ...updatedPillar }
    })
    expect(result.name).toBe(updatedPillar.name)
  })

  // the tree label is derived from name, so it should reflect the update
  it('PATCH /api/pillars/item update is reflected in tree', async () => {
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const node = tree.find((n) => n.value.symbol === testPillar.symbol)
    expect(node?.label).toBe(updatedPillar.name)
  })

  /* DELETE */
  // verifies deletion by re-fetching the full tree rather than trusting the response alone
  it('DELETE /api/pillars/item removes the pillar', async () => {
    await $fetch('/api/pillars/item', {
      method: 'DELETE',
      body: { type: 'pillar', symbol: testPillar.symbol }
    })
    const tree = await $fetch<any[]>('/api/pillars/tree')
    const symbols = tree.map((n) => n.value.symbol)
    expect(symbols).not.toContain(testPillar.symbol)
  })

  afterAll(async () => {
    // safety net in case the delete test didn't run
    await $fetch('/api/pillars/item', {
      method: 'DELETE',
      body: { type: 'pillar', symbol: testPillar.symbol }
    }).catch(() => {})
  })
})
