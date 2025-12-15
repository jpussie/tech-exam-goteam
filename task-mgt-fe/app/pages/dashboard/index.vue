<template>
  <div v-if="tasks.length === 0" class="flex p-40 flex-col h-full bg-white rounded-2xl shadow-sm">
    <TasksTaskInput 
    />
  </div>
  <div class="flex px-40 flex-col h-full bg-white rounded-2xl shadow-sm" v-else>
    <TasksTaskItemList 
    :tasks="tasks"
    @reorder="saveOrder" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '~/types/task'

definePageMeta({
  middleware: 'auth',
})

const dateStore = useDateStore()
const taskStore = useTaskStore()

const saveOrder = async (tasks: Task[]) => {
  await taskStore.reorderTasks(
    tasks.map((task, index) => ({
      id: task.id,
      order: index
    }))
  )
}

watchEffect(() => {
  if (dateStore.selectedDate) {
    taskStore.fetchTasks(dateStore.selectedDate as unknown as string)
  }
})

const tasks = computed<Task[]>(() => taskStore.tasks)
</script>
