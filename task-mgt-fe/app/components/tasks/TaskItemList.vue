<template>
  <main class="flex-1 px-6 py-6 overflow-y-auto space-y-6">

    <!-- DRAGGABLE (INCOMPLETE TASKS ONLY) -->
    <draggable
      :list="activeTasks"
      item-key="id"
      class="space-y-4"
      handle=".drag-handle"
      ghost-class="opacity-40"
      :animation="200"
      @end="syncOrder"
    >
      <template #item="{ element: task }">
        <div
          class="flex items-center justify-between rounded-xl border px-4 py-3 bg-white"
        >
          <label class="flex items-center gap-3 text-sm">
            <!-- DRAG HANDLE -->
            <span class="drag-handle cursor-grab text-gray-400 select-none">
              ☰
            </span>

            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300"
              :checked="task.completed"
              @change="toggleComplete(task)"
            />

            <span class="cursor-pointer" @click="startEdit(task)">
              {{ task.description }}
            </span>
          </label>

          <button
            class="text-gray-400 hover:text-gray-600"
            @click="removeTask(task.id)"
          >
            <Trash2 />
          </button>
        </div>
      </template>
    </draggable>

    <!-- COMPLETED TASKS (LOCKED) -->
    <div v-if="completedTasks.length" class="space-y-4">
      <div
        v-for="task in completedTasks"
        :key="task.id"
        class="flex items-center justify-between rounded-xl border px-4 py-3 bg-gray-50"
      >
        <label class="flex items-center gap-3 text-sm text-gray-400 line-through">
          <input
            type="checkbox"
            checked
            class="h-4 w-4 rounded border-gray-300"
            @change="toggleComplete(task)"
          />
          {{ task.description }}
        </label>
      </div>
    </div>

  </main>

  <!-- Bottom Input -->
  <footer class="px-6 py-4">
    <div class="relative w-full">
      <input
        v-model="taskDescription"
        type="text"
        placeholder="What else do you need to do?"
        class="w-full rounded-full border border-gray-200
               pl-5 pr-14 py-3 text-sm
               focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        @click="submit"
        class="absolute right-2 top-1/2 -translate-y-1/2
               h-9 w-9 rounded-full bg-black text-white
               flex items-center justify-center"
      >
        <ArrowUp class="w-4 h-4" />
      </button>
    </div>
  </footer>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { Trash2, ArrowUp } from 'lucide-vue-next'
import type { Task } from '~/types/task'

const props = defineProps<{ tasks: Task[] }>()

const taskStore = useTaskStore()
const dateStore = useDateStore()

const taskDescription = ref('')
const editingTaskId = ref<number | null>(null)

/* ──────────────── COMPUTED LISTS ──────────────── */
const activeTasks = computed(() =>
  props.tasks.filter(t => !t.completed)
)

const completedTasks = computed(() =>
  props.tasks.filter(t => t.completed)
)

/* ──────────────── ACTIONS ──────────────── */
const toggleComplete = async (task: Task) => {
  await taskStore.updateTask(task.id, {
    completed: !task.completed,
    due_date: dateStore.selectedDate
  })
}

const syncOrder = async () => {
  await taskStore.reorderTasks(
    activeTasks.value.map((task, index) => ({
      id: task.id,
      order: index
    }))
  )
}

const startEdit = (task: Task) => {
  editingTaskId.value = task.id
  taskDescription.value = task.description
}

const submit = async () => {
  if (!taskDescription.value.trim()) return

  if (editingTaskId.value !== null) {
    await taskStore.updateTask(editingTaskId.value, {
      description: taskDescription.value,
      due_date: dateStore.selectedDate
    })
  } else {
    await taskStore.createTask({
      description: taskDescription.value,
      completed: false,
      due_date: dateStore.selectedDate
    })
  }

  taskDescription.value = ''
  editingTaskId.value = null
}

const removeTask = (id: number) => {
  taskStore.deleteTask(id)
}
</script>

