<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { SortableEvent } from 'sortablejs'
import { useSortable } from '@vueuse/integrations/useSortable'
import type { ContextMenuItem } from '@nuxt/ui'

useState('pageTitle').value = 'Pillars'

const { items, saving, flatten, moveItem, debouncedSave, create, update, deleteItem } = useCustomTree()

const selectedItem = ref<TreeItem | undefined>()
const isEditOpen = ref(false)
const isCreateOpen = ref(false)
const isDeleteOpen = ref(false)
const contextItem = ref<TreeItem | undefined>()

const childTypeMap: Record<string, string> = {
  pillar: 'buildingBlock',
  buildingBlock: 'construct',
  construct: 'subconstruct'
}
const canCreate = computed(() => true)

const toast = useToast()

async function handleCreate(newItem: PillarItemCreateSchema) {
  const sel = selectedItem.value?.value
  const isSubconstruct = sel?.type === 'subconstruct'
  const type = !sel ? 'pillar' : isSubconstruct ? 'subconstruct' : childTypeMap[sel.type]!
  const parentSymbol = isSubconstruct ? sel!.parentSymbol : sel?.symbol
  try {
    await create(type, parentSymbol, newItem)
    toast.add({ title: 'Created', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to create', color: 'error' })
    throw 'error'
  }
}

async function handleSave(updates: PillarItemCreateSchema) {
  if (!selectedItem.value) return
  const { symbol, type } = selectedItem.value.value
  try {
    await update(type, symbol, updates)
    toast.add({ title: 'Saved', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to save', color: 'error' })
    throw 'error'
  }
}

async function handleDelete() {
  if (!selectedItem.value) return
  const { symbol, type } = selectedItem.value.value
  try {
    await deleteItem(type, symbol)
    selectedItem.value = undefined
    toast.add({ title: 'Delete Successful', color: 'success' })
  } catch {
    toast.add({ title: 'Failed to delete', color: 'error' })
    throw 'error'
  }
}

const tree = useTemplateRef<HTMLElement>('tree')

useSortable(tree, items, {
  animation: 150,
  ghostClass: 'opacity-50',
  onUpdate: (e: SortableEvent) => {
    if (e.oldIndex && e.newIndex) {
      moveItem(e.oldIndex, e.newIndex)
      debouncedSave().catch(() => toast.add({ title: 'Failed to save order', color: 'error' }))
    }
  }
})

function onContextMenu(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest('[role="treeitem"]')
  if (!el) return
  const label = el.textContent?.trim()
  if (!label) return
  const found = flatten(items.value).find(({ item }) => item.label === label)
  if (found) {
    selectedItem.value = found.item
    contextItem.value = found.item
  }
}

const menuItems = computed<ContextMenuItem[][]>(() => [
  [
    {
      label: 'Create',
      icon: 'i-lucide-plus',
      onSelect() {
        selectedItem.value = contextItem.value
        isCreateOpen.value = true
      }
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      onSelect() {
        selectedItem.value = contextItem.value
        isEditOpen.value = true
      }
    }
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedItem.value = contextItem.value
        isDeleteOpen.value = true
      }
    }
  ]
])
</script>

<template>
  <UContainer class="py-8 h-full flex flex-col">
    <div class="flex justify-end mb-6 shrink-0">
      <div class="flex items-center gap-2">
        <UBadge v-if="saving" color="neutral" variant="subtle">Saving...</UBadge>
        <UButton
          label="Create"
          icon="i-lucide-plus"
          :disabled="!canCreate"
          :color="canCreate ? 'primary' : 'neutral'"
          variant="subtle"
          size="sm"
          @click="canCreate && (isCreateOpen = true)"
        />
        <UButton
          label="Edit"
          icon="i-lucide-pencil"
          :disabled="!selectedItem"
          :color="selectedItem ? 'primary' : 'neutral'"
          variant="subtle"
          size="sm"
          @click="selectedItem && (isEditOpen = true)"
        />
        <UButton
          label="Delete"
          icon="i-lucide-trash"
          :disabled="!selectedItem"
          :color="selectedItem ? 'error' : 'neutral'"
          variant="subtle"
          size="sm"
          @click="selectedItem && (isDeleteOpen = true)"
        />
      </div>
    </div>
    <UContextMenu :items="menuItems">
      <div @contextmenu="onContextMenu">
        <UCard class="flex-1 min-h-0 overflow-auto">
          <UTree
            v-model="selectedItem"
            ref="tree"
            :nested="false"
            :unmount-on-hide="false"
            :items="items"
          >
            <template #item-leading="{ item, level }">
              <UIcon
                v-if="item.icon"
                :name="item.icon"
                :class="[
                  level === 1 && 'text-blue-500',
                  level === 2 && 'text-violet-500',
                  level === 3 && 'text-amber-500',
                  level === 4 && 'text-lime-500'
                ]"
              />
            </template>
          </UTree>
        </UCard>
      </div>
    </UContextMenu>
    <TreeItemModal
      v-model:open="isCreateOpen"
      :item="selectedItem?.value"
      :on-save="handleCreate"
    />
    <TreeItemModal
      v-if="selectedItem"
      v-model:open="isEditOpen"
      :item="selectedItem.value"
      :id="selectedItem.value.symbol"
      :on-save="handleSave"
    />
    <DeleteModal
      v-model:open="isDeleteOpen"
      title="Delete Contact"
      description="Are you sure? This action cannot be undone. Any children associate with this item will also be deleted."
      :on-delete="handleDelete"
    />
  </UContainer>
</template>
