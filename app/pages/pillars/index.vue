<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { SortableEvent } from 'sortablejs'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useDebounceFn } from '@vueuse/core'

useState('pageTitle').value = 'Pillars'

const { data, refresh } = await useAsyncData('pillars-tree', () => $fetch<TreeItem[]>('/api/pillars/tree'))
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

  const insertAt =
    oldIndex < newIndex
      ? targetAfterRemoval.indexInParent + 1 // moving down: insert after target
      : targetAfterRemoval.indexInParent // moving up: insert before target
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
const selectedItem = ref<TreeItem | undefined>()
const isEditOpen = ref(false)


const saving = ref(false)
const toast = useToast()

async function handleSave(updates: PillarItemSchema) {
  if (!selectedItem.value) return
  const { symbol, type } = selectedItem.value.value
  try {
    await $fetch('/api/pillars/item', { method: 'PATCH', body: { type, symbol, ...updates } })
    await refresh()
    items.value = data.value ?? []
    toast.add({ title: 'Saved', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to save', color: 'error' })
    throw 'error'
  }
}

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
  <UContainer class="py-8 h-full flex flex-col">
    <div class="flex justify-end mb-6 shrink-0">
      <div class="flex items-center gap-2">
        <UBadge v-if="saving" color="neutral" variant="subtle">Saving...</UBadge>
        <UButton
          label="Edit"
          icon="i-lucide-pencil"
          :disabled="!selectedItem"
          :color="selectedItem ? 'primary' : 'neutral'"
          variant="subtle"
          size="sm"
          @click="selectedItem && (isEditOpen = true)"
        />
      </div>
    </div>
    <UCard class="flex-1 min-h-0 overflow-auto">
      <UTree
        v-model="selectedItem"
        ref="tree"
        :nested="false"
        :unmount-on-hide="false"
        :items="items"
      />
    </UCard>
    <EditTreeItemModal
      v-if="selectedItem"
      v-model:open="isEditOpen"
      :item="selectedItem.value"
      :on-save="handleSave"
    />
  </UContainer>
</template>
