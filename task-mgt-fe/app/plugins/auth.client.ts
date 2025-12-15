import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore();
  // Load token from cookie automatically handled by store state initialization,
  // but fetch profile from API to hydrate `user`.
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser();
    } catch (e) {
      // ignore
    }
  }
});
