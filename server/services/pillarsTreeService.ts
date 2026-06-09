import { asc, eq } from 'drizzle-orm'
import { db } from '~~/server/db/index'
import { pillars, buildingBlocks, constructs, subconstructs } from '~~/server/db/schema'
import type { NodeType, PillarTreeItem } from '~~/shared/types/treeItem'

type TreeNode = {
  label: string
  icon: string
  value: PillarTreeItem
  defaultExpanded: boolean
  ui?: { linkLeadingIcon?: string }
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
    value: { symbol: p.symbol, type: 'pillar', order: p.order, name: p.name },
    defaultExpanded: true,
    children: p.buildingBlocks.map((bb) => ({
      label: bb.name,
      icon: 'i-lucide-box',
      value: {
        symbol: bb.symbol,
        type: 'buildingBlock',
        order: bb.order,
        name: bb.name,
        parentSymbol: p.symbol
      },
      defaultExpanded: true,
      children: bb.constructs.map((c) => ({
        label: c.name,
        icon: 'i-lucide-puzzle',
        value: {
          symbol: c.symbol,
          type: 'construct',
          order: c.order,
          name: c.name,
          parentSymbol: bb.symbol
        },
        defaultExpanded: true,
        children: c.subconstructs.map((sc) => ({
          label: sc.name,
          icon: 'i-lucide-circle-dot',
          value: {
            symbol: sc.symbol,
            type: 'subconstruct',
            order: sc.order,
            name: sc.name,
            parentSymbol: c.symbol
          },
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

export async function updateItem(type: NodeType, symbol: string, name: string, order: number) {
  return db.transaction(async (tx) => {
    const { table, siblings } = await getSiblings(tx, type, symbol)
    await renumberSiblings(tx, table, siblings, symbol, name, order)
    if (type === 'pillar')
      return (await tx.select().from(pillars).where(eq(pillars.symbol, symbol)))[0]!
    if (type === 'buildingBlock')
      return (await tx.select().from(buildingBlocks).where(eq(buildingBlocks.symbol, symbol)))[0]!
    if (type === 'construct')
      return (await tx.select().from(constructs).where(eq(constructs.symbol, symbol)))[0]!
    return (await tx.select().from(subconstructs).where(eq(subconstructs.symbol, symbol)))[0]!
  })
}

async function getSiblingsByParent(
  tx: Tx,
  type: NodeType,
  parentSymbol?: string
): Promise<{ table: SiblingTable; siblings: { symbol: string }[] }> {
  if (type === 'pillar') {
    return { table: pillars, siblings: await tx.select().from(pillars).orderBy(asc(pillars.order)) }
  }
  if (type === 'buildingBlock') {
    return {
      table: buildingBlocks,
      siblings: await tx
        .select()
        .from(buildingBlocks)
        .where(eq(buildingBlocks.pillarSymbol, parentSymbol))
        .orderBy(asc(buildingBlocks.order))
    }
  }
  if (type === 'construct') {
    return {
      table: constructs,
      siblings: await tx
        .select()
        .from(constructs)
        .where(eq(constructs.buildingBlockSymbol, parentSymbol))
        .orderBy(asc(constructs.order))
    }
  }
  return {
    table: subconstructs,
    siblings: await tx
      .select()
      .from(subconstructs)
      .where(eq(subconstructs.constructSymbol, parentSymbol))
      .orderBy(asc(subconstructs.order))
  }
}

export async function createItem(
  type: NodeType,
  parentSymbol: string | undefined,
  symbol: string,
  name: string,
  order: number
) {
  return db.transaction(async (tx) => {
    const { table, siblings } = await getSiblingsByParent(tx, type, parentSymbol)
    const ordered = reinsert([...siblings, { symbol }], symbol, order)
    const finalOrder = ordered.findIndex((i) => i.symbol === symbol) + 1

    let newRow: Record<string, unknown>
    if (type === 'pillar') {
      newRow = (
        await tx.insert(pillars).values({ symbol, name, order: finalOrder }).returning()
      )[0]!
    } else if (type === 'buildingBlock') {
      newRow = (
        await tx
          .insert(buildingBlocks)
          .values({ symbol, name, order: finalOrder, pillarSymbol: parentSymbol! })
          .returning()
      )[0]!
    } else if (type === 'construct') {
      newRow = (
        await tx
          .insert(constructs)
          .values({ symbol, name, order: finalOrder, buildingBlockSymbol: parentSymbol! })
          .returning()
      )[0]!
    } else {
      newRow = (
        await tx
          .insert(subconstructs)
          .values({ symbol, name, order: finalOrder, constructSymbol: parentSymbol! })
          .returning()
      )[0]!
    }

    for (const [i, item] of ordered.entries()) {
      if (item.symbol !== symbol) {
        await tx
          .update(table)
          .set({ order: i + 1 })
          .where(eq(table.symbol, item.symbol))
      }
    }

    return newRow
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

export async function deleteItem(type: NodeType, symbol: string) {
  if (type === 'pillar') return db.delete(pillars).where(eq(pillars.symbol, symbol))
  if (type === 'buildingBlock')
    return db.delete(buildingBlocks).where(eq(buildingBlocks.symbol, symbol))
  if (type === 'construct') return db.delete(constructs).where(eq(constructs.symbol, symbol))
  return db.delete(subconstructs).where(eq(subconstructs.symbol, symbol))
}
