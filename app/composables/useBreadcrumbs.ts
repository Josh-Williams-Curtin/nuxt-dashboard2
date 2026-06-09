import type { BreadcrumbItem } from '@nuxt/ui'

export function useBreadcrumbs() {
  const route = useRoute()

  return computed<BreadcrumbItem[]>(() => {
    if (route.path === '/') {
      const home = navItems.find((n) => n.to === '/')
      return [{ label: home?.label ?? 'Home', icon: home?.icon, to: '/' }]
    }

    const items: BreadcrumbItem[] = []
    let path = ''

    for (const segment of route.path.split('/').filter(Boolean)) {
      path += `/${segment}`
      if (!isNaN(Number(segment))) continue
      const nav = navItems.find((n) => n.to === path)
      items.push({
        label: nav?.label ?? segment.charAt(0).toUpperCase() + segment.slice(1),
        icon: nav?.icon,
        to: path
      })
    }

    return items
  })
}
