// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  // Wait for hydration
  if (!auth.hydrated) {
    await auth.fetchUser()
  }

  // After hydration, decide
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
