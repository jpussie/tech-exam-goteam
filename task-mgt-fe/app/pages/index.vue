<!-- app/pages/index.vue -->
<script setup lang="ts">
const auth = useAuthStore()

if (!auth.hydrated) {
  await auth.fetchUser()
}

if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
} else {
  await navigateTo('/login')
}
</script>

<template>
  <div />
</template>
