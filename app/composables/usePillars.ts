import type { TreeItem } from '@nuxt/ui'
import { useDebounceFn } from '@vueuse/core'

export const usePillars = () => {
  const items = useState<TreeItem[]>('pillars-tree', () => [])
  const saving = ref(false)

  const { pending, refresh } = useAsyncData('pillars-tree', () => $fetch<TreeItem[]>('/api/pillars/tree'), {
    immediate: true,
    transform: (data) => (items.value = data)
  })

  type FlatNode = { item: TreeItem; parent: TreeItem[]; indexInParent: number }

  function flatten(nodes: TreeItem[], parent = nodes): FlatNode[] {
    return nodes.flatMap((item, indexInParent) => [
      { item, parent, indexInParent },
      ...(item.children?.length && item.defaultExpanded ? flatten(item.children, item.children) : [])
    ])
  }

  function moveItem(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return

    const flat = flatten(items.value)
    const source = flat[oldIndex]
    const target = flat[newIndex]
    if (!source || !target) return

    // Re-flatten after removal because splicing shifts sibling indices
    const [moved] = source.parent.splice(source.indexInParent, 1)
    if (!moved) return

    const targetAfterRemoval = flatten(items.value).find(({ item }) => item === target.item)
    if (!targetAfterRemoval) return

    const insertAt =
      oldIndex < newIndex
        ? targetAfterRemoval.indexInParent + 1
        : targetAfterRemoval.indexInParent
    targetAfterRemoval.parent.splice(insertAt, 0, moved)
  }

  function extractOrders(nodes: TreeItem[]) {
    const pillarsOut: { symbol: string; order: number }[] = []
    const buildingBlocksOut: { symbol: string; order: number; pillarSymbol: string }[] = []
    const constructsOut: { symbol: string; order: number; buildingBlockSymbol: string }[] = []
    const subconstrucetsOut: { symbol: string; order: number; constructSymbol: string }[] = []

    nodes.forEach((pillarItem, pi) => {
      pillarsOut.push({ symbol: pillarItem.value.symbol, order: pi + 1 })
      pillarItem.children?.forEach((bbItem, bbi) => {
        const pillarSymbol = pillarItem.value.symbol
        buildingBlocksOut.push({ symbol: bbItem.value.symbol, order: bbi + 1, pillarSymbol })
        bbItem.children?.forEach((cItem, ci) => {
          const buildingBlockSymbol = bbItem.value.symbol
          constructsOut.push({ symbol: cItem.value.symbol, order: ci + 1, buildingBlockSymbol })
          cItem.children?.forEach((scItem, sci) => {
            subconstrucetsOut.push({
              symbol: scItem.value.symbol,
              order: sci + 1,
              constructSymbol: cItem.value.symbol
            })
          })
        })
      })
    })

    return {
      pillars: pillarsOut,
      buildingBlocks: buildingBlocksOut,
      constructs: constructsOut,
      subconstructs: subconstrucetsOut
    }
  }

  async function create(type: string, parentSymbol: string | undefined, data: PillarItemCreateSchema) {
    await $fetch('/api/pillars/item', { method: 'POST', body: { type, parentSymbol, ...data } })
    await refresh()
  }

  async function update(type: string, symbol: string, data: PillarItemCreateSchema) {
    await $fetch('/api/pillars/item', { method: 'PATCH', body: { ...data, type, symbol } })
    await refresh()
  }

  async function remove(type: string, symbol: string) {
    await $fetch('/api/pillars/item', { method: 'DELETE', body: { type, symbol } })
    await refresh()
  }

  async function save() {
    saving.value = true
    try {
      await $fetch('/api/pillars/reorder', { method: 'PATCH', body: extractOrders(items.value) })
    } finally {
      saving.value = false
    }
  }

  const debouncedSave = useDebounceFn(save, 500)

  return { items, pending, saving, flatten, moveItem, debouncedSave, create, update, remove }
}
