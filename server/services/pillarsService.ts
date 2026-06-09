import { asc, eq } from 'drizzle-orm'
import { db } from '~~/server/db/index'
import { pillars, buildingBlocks, constructs, subconstructs } from '~~/server/db/schema'

type NodeType = 'pillar' | 'buildingBlock' | 'construct' | 'subconstruct'

type TreeNode = {
  label: string
  icon: string
  value: { symbol: string; type: NodeType; order: number }
  defaultExpanded: boolean
  children?: TreeNode[]
}

export async function getPillarsTree(): Promise<TreeNode[]> {
  const rows = await db.query.pillars.findMany({
    orderBy: asc(pillars.order),
    with: {
      buildingBlocks: {
        orderBy: asc(buildingBlocks.order),
        with: {
          constructs: {
            orderBy: asc(constructs.order),
            with: {
              subconstructs: { orderBy: asc(subconstructs.order) }
            }
          }
        }
      }
    }
  })

  return rows.map((p) => ({
    label: p.name,
    icon: 'i-lucide-layers',
    value: { symbol: p.symbol, type: 'pillar' as const, order: p.order },
    defaultExpanded: true,
    children: p.buildingBlocks.map((bb) => ({
      label: bb.name,
      icon: 'i-lucide-box',
      value: { symbol: bb.symbol, type: 'buildingBlock' as const, order: bb.order },
      defaultExpanded: true,
      children: bb.constructs.map((c) => ({
        label: c.name,
        icon: 'i-lucide-puzzle',
        value: { symbol: c.symbol, type: 'construct' as const, order: c.order },
        defaultExpanded: true,
        children: c.subconstructs.map((sc) => ({
          label: sc.name,
          icon: 'i-lucide-circle-dot',
          value: { symbol: sc.symbol, type: 'subconstruct' as const, order: sc.order },
          defaultExpanded: false
        }))
      }))
    }))
  }))
}

type SiblingTable =
  | typeof pillars
  | typeof buildingBlocks
  | typeof constructs
  | typeof subconstructs
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

function reinsert<T extends { symbol: string }>(
  items: T[],
  symbol: string,
  targetOrder: number
): T[] {
  const result = [...items]
  const from = result.findIndex((i) => i.symbol === symbol)
  const [item] = result.splice(from, 1)
  result.splice(Math.min(Math.max(targetOrder - 1, 0), result.length), 0, item!)
  return result
}

async function getSiblings(
  tx: Tx,
  type: NodeType,
  symbol: string
): Promise<{ table: SiblingTable; siblings: { symbol: string }[] }> {
  if (type === 'pillar') {
    return { table: pillars, siblings: await tx.select().from(pillars).orderBy(asc(pillars.order)) }
  }
  if (type === 'buildingBlock') {
    const [cur] = await tx
      .select({ pillarSymbol: buildingBlocks.pillarSymbol })
      .from(buildingBlocks)
      .where(eq(buildingBlocks.symbol, symbol))
    return {
      table: buildingBlocks,
      siblings: await tx
        .select()
        .from(buildingBlocks)
        .where(eq(buildingBlocks.pillarSymbol, cur!.pillarSymbol))
        .orderBy(asc(buildingBlocks.order))
    }
  }
  if (type === 'construct') {
    const [cur] = await tx
      .select({ buildingBlockSymbol: constructs.buildingBlockSymbol })
      .from(constructs)
      .where(eq(constructs.symbol, symbol))
    return {
      table: constructs,
      siblings: await tx
        .select()
        .from(constructs)
        .where(eq(constructs.buildingBlockSymbol, cur!.buildingBlockSymbol))
        .orderBy(asc(constructs.order))
    }
  }
  const [cur] = await tx
    .select({ constructSymbol: subconstructs.constructSymbol })
    .from(subconstructs)
    .where(eq(subconstructs.symbol, symbol))
  return {
    table: subconstructs,
    siblings: await tx
      .select()
      .from(subconstructs)
      .where(eq(subconstructs.constructSymbol, cur!.constructSymbol))
      .orderBy(asc(subconstructs.order))
  }
}

async function renumberSiblings(
  tx: Tx,
  table: SiblingTable,
  siblings: { symbol: string }[],
  targetSymbol: string,
  newName: string,
  newOrder: number
): Promise<void> {
  for (const [i, item] of reinsert(siblings, targetSymbol, newOrder).entries()) {
    await tx
      .update(table)
      .set({ order: i + 1, ...(item.symbol === targetSymbol ? { name: newName } : {}) })
      .where(eq(table.symbol, item.symbol))
  }
}

export async function updateItem(
  type: NodeType,
  symbol: string,
  name: string,
  order: number
): Promise<void> {
  await db.transaction(async (tx) => {
    const { table, siblings } = await getSiblings(tx, type, symbol)
    await renumberSiblings(tx, table, siblings, symbol, name, order)
  })
}

export type ReorderData = {
  pillars: { symbol: string; order: number }[]
  buildingBlocks: { symbol: string; order: number; pillarSymbol: string }[]
  constructs: { symbol: string; order: number; buildingBlockSymbol: string }[]
  subconstructs: { symbol: string; order: number; constructSymbol: string }[]
}

export async function reorderTree(data: ReorderData): Promise<void> {
  await db.transaction(async (tx) => {
    for (const p of data.pillars) {
      await tx.update(pillars).set({ order: p.order }).where(eq(pillars.symbol, p.symbol))
    }
    for (const bb of data.buildingBlocks) {
      await tx
        .update(buildingBlocks)
        .set({ order: bb.order, pillarSymbol: bb.pillarSymbol })
        .where(eq(buildingBlocks.symbol, bb.symbol))
    }
    for (const c of data.constructs) {
      await tx
        .update(constructs)
        .set({ order: c.order, buildingBlockSymbol: c.buildingBlockSymbol })
        .where(eq(constructs.symbol, c.symbol))
    }
    for (const sc of data.subconstructs) {
      await tx
        .update(subconstructs)
        .set({ order: sc.order, constructSymbol: sc.constructSymbol })
        .where(eq(subconstructs.symbol, sc.symbol))
    }
  })
}
