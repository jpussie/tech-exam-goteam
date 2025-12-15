<script setup>
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
</script>

<template>
  <div>
    <div><AppHeader /></div>
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
