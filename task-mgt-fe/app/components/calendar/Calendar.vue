<template>
  <div class="space-y-6 text-sm">

    <!-- TODAY -->
    <div>
      <button
        @click="selectDate(today)"
        :class="[
          'w-full text-left px-4 py-2 rounded-full font-medium',
          isSelected(today)
            ? 'bg-black text-white'
            : 'hover:bg-gray-100'
        ]"
      >
        Today
      </button>

      <button
        @click="selectDate(yesterday)"
        :class="[
          'w-full text-left px-4 py-2 rounded-full mt-1',
          isSelected(yesterday)
            ? 'bg-black text-white'
            : 'hover:bg-gray-100'
        ]"
      >
        Yesterday
      </button>
    </div>

    <!-- LAST WEEK -->
    <div>
      <p class="px-4 mb-2 text-xs text-gray-400 uppercase">
        {{ weekOfTheMonthFirst }}
      </p>

      <ul class="space-y-1">
        <li
          v-for="date in lastWeekDays"
          :key="date.toISOString()"
        >
          <button
            @click="selectDate(date)"
            :class="[
              'w-full text-left px-4 py-2 rounded-full',
              isSelected(date)
                ? 'bg-black text-white'
                : 'hover:bg-gray-100'
            ]"
          >
            {{ formatDay(date) }}
          </button>
        </li>
      </ul>
    </div>
    <!-- WEEK BEFORE LAST -->
    <div>
        <p class="px-4 mb-2 text-xs text-gray-400 uppercase">
            {{ weekOfTheMonthSecond }}
        </p>

        <ul class="space-y-1">
            <li
                v-for="date in weekBeforeLastDays"
                :key="date.toISOString()"
            >
                <button
                    @click="selectDate(date)"
                    :class="[
                        'w-full text-left px-4 py-2 rounded-full',
                        isSelected(date)
                            ? 'bg-black text-white'
                            : 'hover:bg-gray-100'
                    ]"
                >
                    {{ formatDay(date) }}
                </button>
            </li>
        </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDateStore } from '@/stores/date'

onMounted(() => {
  const today = new Date()
  selectDate(today)
})

const dateStore = useDateStore()
const selectedDate = ref(new Date())
const weekOfTheMonthFirst = ref('Last Week');
const weekOfTheMonthSecond = ref('A Week Before Last Week');

const normalize = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const today = normalize(new Date())

const yesterday = normalize(new Date(Date.now() - 86400000))

const daysAgo = (n: number) =>
  normalize(new Date(Date.now() - n * 86400000))

const formatDay = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

const isSelected = (date: Date) =>
  normalize(date).getTime() === normalize(selectedDate.value).getTime()

const lastWeekDays = computed(() => {  
    var dates = Array.from({ length: 7 }, (_, i) => daysAgo(i + 2))
    // var numOfWeek = 
    return dates
})

const weekBeforeLastDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => daysAgo(i + 9))
})

const selectDate = (date: Date) => {
  selectedDate.value = date
  dateStore.setSelectedDate(date)
  console.log(selectedDate.value);
}

watch(
  () => dateStore.selectedDate,
  (newDate) => {
    if (newDate) {
      selectedDate.value = normalize(new Date(newDate))
    }
  },
  { immediate: true }
)

</script>

