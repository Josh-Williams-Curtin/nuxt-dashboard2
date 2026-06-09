<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const open = useState('sidebarOpen', () => true)
const colorMode = useColorMode()
const appConfig = useAppConfig()
const { user: sessionUser, clear } = useUserSession()

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
]
const neutrals = ['slate', 'gray', 'zinc', 'stone']

async function logout() {
  await clear()
  await navigateTo('/login')
}

const items = navItems

const user = computed(() => ({
  name: sessionUser.value?.name ?? '',
  avatar: { alt: sessionUser.value?.name ?? '' }
}))

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: 'Profile', icon: 'i-lucide-user' },
    { label: 'Settings', icon: 'i-lucide-settings' }
  ],
  [
    {
      label: 'Theme',
      icon: 'i-lucide-palette',
      children: [
        {
          label: 'Primary',
          slot: 'chip',
          chip: appConfig.ui.colors.primary,
          content: { align: 'center', collisionPadding: 16 },
          children: colors.map((color) => ({
            label: color,
            chip: color,
            slot: 'chip',
            checked: appConfig.ui.colors.primary === color,
            type: 'checkbox',
            onSelect(e: Event) {
              e.preventDefault()
              appConfig.ui.colors.primary = color
            }
          }))
        },
        {
          label: 'Secondary',
          slot: 'chip',
          chip: appConfig.ui.colors.secondary,
          content: { align: 'center', collisionPadding: 16 },
          children: colors.map((color) => ({
            label: color,
            chip: color,
            slot: 'chip',
            checked: appConfig.ui.colors.secondary === color,
            type: 'checkbox',
            onSelect(e: Event) {
              e.preventDefault()
              appConfig.ui.colors.secondary = color
            }
          }))
        },
        {
          label: 'Neutral',
          slot: 'chip',
          chip: appConfig.ui.colors.neutral,
          content: { align: 'end', collisionPadding: 16 },
          children: neutrals.map((color) => ({
            label: color,
            chip: color,
            slot: 'chip',
            checked: appConfig.ui.colors.neutral === color,
            type: 'checkbox',
            onSelect(e: Event) {
              e.preventDefault()
              appConfig.ui.colors.neutral = color
            }
          }))
        }
      ]
    },
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onUpdateChecked(checked: boolean) {
            if (checked) colorMode.preference = 'light'
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) colorMode.preference = 'dark'
          },
          onSelect(e: Event) {
            e.preventDefault()
          }
        }
      ]
    }
  ],
  [{ label: 'Log out', icon: 'i-lucide-log-out', onSelect: logout }]
])
</script>

<template>
  <USidebar v-model:open="open" collapsible="icon" :ui="{ container: 'h-full' }">
    <template #header>
      <UIcon name="i-simple-icons-nuxtdotjs" class="size-8 shrink-0 text-primary" />
      <span class="font-semibold truncate">Nuxt</span>
    </template>

    <UNavigationMenu
      :items="items"
      orientation="vertical"
      :ui="{ link: 'p-1.5 overflow-hidden' }"
    />

    <template #footer>
      <UDropdownMenu
        :items="userItems"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
      >
        <UButton
          v-bind="user"
          :label="user.name"
          trailing-icon="i-lucide-chevrons-up-down"
          color="neutral"
          variant="ghost"
          square
          class="w-full data-[state=open]:bg-elevated overflow-hidden"
          :ui="{ trailingIcon: 'text-dimmed ms-auto' }"
        />

        <template #chip-leading="{ item }">
          <span class="inline-flex size-5 items-center justify-center shrink-0">
            <span
              class="rounded-full size-2"
              :style="{ backgroundColor: `var(--color-${(item as any).chip}-500)` }"
            />
          </span>
        </template>
      </UDropdownMenu>
    </template>
  </USidebar>
</template>
