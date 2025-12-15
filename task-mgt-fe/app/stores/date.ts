import { defineStore } from 'pinia'

export const useDateStore = defineStore('date', {
  state: () => ({
    selectedDate: null as Date | null
  }),
  actions: {
    setSelectedDate(date: Date) {
      this.selectedDate = formatDateYYYYMMDD(date) as unknown as Date
    }
  }
})

const formatDateYYYYMMDD = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}