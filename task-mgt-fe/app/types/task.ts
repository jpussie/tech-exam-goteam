export interface Task {
  id: number
  due_date: Date | null
  description: string
  completed: boolean
  order: number
  created_at: Date
}