export type KanbanColumn = 'backlog' | 'in-progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  column: KanbanColumn
  priority: TaskPriority
  assignee?: string
  dueDate?: Date
}

export interface ColumnConfig {
  id: KanbanColumn
  label: string
  color: string
}
