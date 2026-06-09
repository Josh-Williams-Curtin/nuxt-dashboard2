import type { NavigationMenuItem } from '@nuxt/ui'

export const navItems = [
  { label: 'Home', icon: 'i-lucide-house', to: '/' },
  { label: 'Contacts', icon: 'i-lucide-users', to: '/contacts' },
  { label: 'Pillars Tree', icon: 'i-lucide-layers', to: '/pillarsTree' }
] satisfies NavigationMenuItem[]
