<template>
  <div class="flex p-40 flex-col h-full bg-white rounded-2xl shadow-sm">
    <h1 class="text-3xl font-bold text-center mb-6">
      What do you have in mind?
    </h1>

    <TaskInput
      v-model="modelValue"
      @submit="emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import TaskInput from './TaskInput.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'submit'): void
}>()
</script>
