import { asc, eq } from 'drizzle-orm'
import { db } from '~~/server/db/index'
import { pillars, buildingBlocks, constructs, subconstructs } from '~~/server/db/schema'

type TreeNode = {
  label: string
  icon: string
  value: { symbol: string }
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
    value: { symbol: p.symbol },
    defaultExpanded: true,
    children: p.buildingBlocks.map((bb) => ({
      label: bb.name,
      icon: 'i-lucide-box',
      value: { symbol: bb.symbol },
      defaultExpanded: true,
      children: bb.constructs.map((c) => ({
        label: c.name,
        icon: 'i-lucide-puzzle',
        value: { symbol: c.symbol },
        defaultExpanded: true,
        children: c.subconstructs.map((sc) => ({
          label: sc.name,
          icon: 'i-lucide-circle-dot',
          value: { symbol: sc.symbol },
          defaultExpanded: false
        }))
      }))
    }))
  }))
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
      await tx.update(buildingBlocks)
        .set({ order: bb.order, pillarSymbol: bb.pillarSymbol })
        .where(eq(buildingBlocks.symbol, bb.symbol))
    }
    for (const c of data.constructs) {
      await tx.update(constructs)
        .set({ order: c.order, buildingBlockSymbol: c.buildingBlockSymbol })
        .where(eq(constructs.symbol, c.symbol))
    }
    for (const sc of data.subconstructs) {
      await tx.update(subconstructs)
        .set({ order: sc.order, constructSymbol: sc.constructSymbol })
        .where(eq(subconstructs.symbol, sc.symbol))
    }
  })
}
