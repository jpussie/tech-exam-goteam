// app/middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (!auth.hydrated) {
    await auth.fetchUser()
  }

  if (auth.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
