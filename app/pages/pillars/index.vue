<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { SortableEvent } from 'sortablejs'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useDebounceFn } from '@vueuse/core'

const { data } = await useAsyncData('pillars-tree', () => $fetch<TreeItem[]>('/api/pillars/tree'))
const items = shallowRef<TreeItem[]>(data.value ?? [])

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

  const insertAt = oldIndex < newIndex
    ? targetAfterRemoval.indexInParent + 1  // moving down: insert after target
    : targetAfterRemoval.indexInParent      // moving up: insert before target
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

const saving = ref(false)
const toast = useToast()

async function save() {
  saving.value = true
  try {
    await $fetch('/api/pillars/reorder', { method: 'PATCH', body: extractOrders(items.value) })
  } catch {
    toast.add({ title: 'Failed to save order', color: 'error' })
  } finally {
    saving.value = false
  }
}

const debouncedSave = useDebounceFn(save, 500)

const tree = useTemplateRef<HTMLElement>('tree')

useSortable(tree, items, {
  animation: 150,
  ghostClass: 'opacity-50',
  onUpdate: (e: SortableEvent) => {
    if (e.oldIndex && e.newIndex) {
      moveItem(e.oldIndex, e.newIndex)
      debouncedSave()
    }
  }
})
</script>

<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Pillars</h1>
      <UBadge v-if="saving" color="neutral" variant="subtle">Saving...</UBadge>
    </div>
    <UCard>
      <UTree ref="tree" :nested="false" :unmount-on-hide="false" :items="items" />
    </UCard>
  </UContainer>
</template>
