<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({ title: 'nuxt-dashboard' })

const sidebarOpen = useState('sidebarOpen', () => true)
</script>

<template>
  <UApp>
    <div class="flex h-screen overflow-hidden">
      <AppSidebar />

      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div class="h-(--ui-header-height) shrink-0 flex items-center px-4 border-b border-default">
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="sidebarOpen = !sidebarOpen"
          />
        </div>

        <div class="flex-1 overflow-auto">
          <NuxtPage />
        </div>
      </div>
    </div>
  </UApp>
</template>
