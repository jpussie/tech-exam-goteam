import { defineStore, mapActions } from 'pinia'
import type { Task } from '~/types/task'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    searchResults: [] as Task[],
  }),
  actions: {
    setTasks(tasks: Task[]) {
      this.tasks = tasks;
    },

    setSearchResults(results: Task[]) {
      this.searchResults = results;
    },

    async fetchTasks(dueDate?: string) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()
      console.log(auth.token);
      
      var res = await $fetch(`${config.public.apiBase}/tasks`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        query: dueDate ? { due_date: dueDate } : {},
      })
      console.log('response ni', res);
      
      this.setTasks(res?.data as Task[]);
    },

    async createTask(data: Partial<Task>) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()

      var res = await $fetch(`${config.public.apiBase}/tasks`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      this.tasks.push(res?.data as Task)
    },

    async deleteTask(id: number) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()

      await $fetch(`${config.public.apiBase}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      this.tasks = this.tasks.filter(t => t.id !== id)
    },
    async updateTask(id: number, data: Partial<Task>) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()

      const res = await $fetch<Task>(
        `${config.public.apiBase}/tasks/${id}`,
        {
          method: 'PUT',
          body: data,
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )

      const index = this.tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        this.tasks[index] = res.data as Task
      }
    },

    async reorderTasks(tasks: { id: number; order: number }[]) {
      const auth = useAuthStore()
      const config = useRuntimeConfig()

      // 🔥 THIS IS WHAT WAS MISSING
      this.tasks = this.tasks
        .map(t => {
          const found = tasks.find(o => o.id === t.id)
          return found ? { ...t, order: found.order } : t
        })
        .sort((a, b) => a.order - b.order)

      await $fetch(`${config.public.apiBase}/tasks/reorder`, {
        method: 'POST',
        body: { tasks },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      })
    },
    
    async searchTasks(query: string) {
      if (!query.trim()) {
        this.searchResults = []
        return
      }

      const auth = useAuthStore()
      const config = useRuntimeConfig()

      var res = await $fetch(
        `${config.public.apiBase}/tasks/search`,
        {
          params: { q: query },
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )

      this.searchResults = res?.data as Task[]
    }
  }
})