<template>
  <header class="h-20 flex items-center justify-between px-10 border-b">
    <div class="w-12 h-12 overflow-hidden"> 
      <div class="flex justify-center mb-6">
        <img
          src="/images/logo.png"
          alt="App Logo"
          class="h-12 w-auto"
        />
      </div>
    </div>
    <div class="relative w-1/4 search-wrapper">
      <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

      <input
        v-model="search"
        type="text"
        placeholder="Search tasks"
        class="w-full pl-10 pr-4 py-2 border rounded-full bg-white
              focus:ring-2 focus:ring-black"
        @focus="openSearchDropdown = true"
         @input="onSearch(search)"
      />

      <!-- SEARCH RESULTS -->
      <div
        v-if="openSearchDropdown && searchResults.length"
        class="absolute mt-2 w-full rounded-xl border bg-white shadow-lg z-50"
      >
        <button
          v-for="task in searchResults"
          :key="task.id"
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          @click="selectTask(task)"
        >
          <div class="font-medium truncate">
            {{ task.description }}
          </div>
          <div class="text-xs text-gray-400">
            {{ new Date(task.due_date).toDateString() }}
          </div>
        </button>
      </div>
    </div>
    <!-- Avatar + Dropdown --> 
     <div class="relative"> 
        <button @click="open = !open" class="w-12 h-12 rounded-full overflow-hidden border" > 
          <img src="https://i.pravatar.cc/100" class="w-full h-full object-cover" /> 
        </button> 
        <div v-if="open" class="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg z-50" > 
          <div class="px-4 py-3 border-b">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ auth.user?.name }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ auth.user?.email }}
            </p>
          </div>
          <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" 
            @click="logout" > 
            Logout 
          </button> 
        </div>
      </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Search } from 'lucide-vue-next'
import type { Task } from '~/types/task'
import { useDebounceFn } from '@vueuse/core'

const auth = useAuthStore()
const taskStore = useTaskStore()
const dateStore = useDateStore()

const open = ref(false)
const openSearchDropdown = ref(false)
const search = ref('')

/* 🔍 SEARCH RESULTS */
const searchResults = computed(() => taskStore.searchResults)

const onSearch = useDebounceFn((value: string) => {
  taskStore.searchTasks(value)
}, 300)

/* 📅 SELECT TASK → SWITCH DATE */
const selectTask = async (task: Task) => {
  const date = new Date(task.due_date)

  // switch calendar day
  dateStore.setSelectedDate(date)

  // reset UI
  search.value = ''
  openSearchDropdown.value = false
}

/* 🧠 dropdown close logic */
const handleClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.search-wrapper')) {
    openSearchDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const logout = async () => {
  await auth.logout()
  await navigateTo('/login', { replace: true })
}

</script>
