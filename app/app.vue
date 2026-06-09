<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({ title: 'Nuxt Dashboard' })

const sidebarOpen = useState('sidebarOpen', () => true)
const pageTitle = useState<string>('pageTitle', () => '')
const { loggedIn } = useUserSession()
</script>

<template>
  <UApp>
    <div class="flex h-screen overflow-hidden">
      <AppSidebar v-if="loggedIn" />

      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div
          v-if="loggedIn"
          class="h-(--ui-header-height) shrink-0 flex items-center gap-2 px-4 border-b border-default"
        >
          <UButton
            icon="i-lucide-panel-left"
            color="neutral"
            variant="ghost"
            aria-label="Toggle sidebar"
            @click="sidebarOpen = !sidebarOpen"
          />
          <span v-if="pageTitle" class="text-2xl font-bold">{{ pageTitle }}</span>
        </div>

        <div class="flex-1 overflow-auto">
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </div>
      </div>
    </div>
  </UApp>
</template>
