<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const open = useState('sidebarOpen', () => true)
const colorMode = useColorMode()

const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
  },
  {
    label: 'Contacts',
    icon: 'i-lucide-users',
    to: '/contacts'
  }
]

const user = ref({
  name: 'Josh Williams',
  avatar: { alt: 'Josh Williams' }
})

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    { label: 'Profile', icon: 'i-lucide-user' },
    { label: 'Settings', icon: 'i-lucide-settings' }
  ],
  [
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
  [{ label: 'Log out', icon: 'i-lucide-log-out' }]
])
</script>

<template>
  <USidebar v-model:open="open" collapsible="icon" :ui="{ container: 'h-full' }">
    <template #header>
      <UIcon name="i-logos-nuxt-icon" class="size-8" />
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
      </UDropdownMenu>
    </template>
  </USidebar>
</template>
