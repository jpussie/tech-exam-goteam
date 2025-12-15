import { defineStore } from 'pinia';
import type { User } from '~/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie('auth_token').value as string | null,
    loading: false,
    error: null as string | null,
    hydrated: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.user?.name ?? '',
  },

  actions: {
    setToken(token: string | null) {
      const cookie = useCookie('auth_token');
      cookie.value = token;
      this.token = token;
    },

    setUser(user: any) {
      this.user = user;
    },

    async login(payload: { email: string; password: string }) {
      this.loading = true;
      this.error = null;
      try {
        const config = useRuntimeConfig();
        const res = await $fetch(`${config.public.apiBase}/login`, {
          method: 'POST',
          body: payload,
        });

        this.setToken(res.token);
        this.setUser(res.user);
        
        return res;
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Login failed';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.hydrated = true
        return
      }

      try {
        const config = useRuntimeConfig()
        const user = await $fetch(`${config.public.apiBase}/user`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })

        this.setUser(user)
      } catch (e) {
        // token invalid → logout
        this.token = null
        useCookie('auth_token').value = null
      } finally {
        this.hydrated = true
      }
    },

    async logout() {
      if (!this.token) {
        this.setToken(null);
        this.setUser(null);
        return;
      }

      try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBase}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
      } catch (e) {
        // ignore errors
      } finally {
        this.setToken(null);
        this.setUser(null);
      }
    }
  }
});
