<script setup lang="ts">
const breadcrumbs = useBreadcrumbs()
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <UBreadcrumb v-if="breadcrumbs.length > 1" :items="breadcrumbs" />
    <slot />
  </div>
</template>
