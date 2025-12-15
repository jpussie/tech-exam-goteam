<template>
  <h1 class="text-3xl font-bold text-center mb-6">
      What do you have in mind?
  </h1>
  <div class="flex items-center w-[1300px] bg-white border rounded-xl p-4 shadow-sm ">
    <textarea
      v-model="taskDescription"
      placeholder="Write the task you plan to do today here..."
      class="w-full h-24 resize-none outline-none"
    ></textarea>

    <button
      @click="submit"
      class="ml-4 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const taskDescription = ref('')

const dateStore = useDateStore()
const taskStore = useTaskStore()

const submit = () => {
  if (taskDescription.value.trim() === '') return
  
  taskStore.createTask({
    due_date: dateStore.selectedDate,
    description: taskDescription.value,
    completed: false
  })

  taskDescription.value = ''
}
</script>
