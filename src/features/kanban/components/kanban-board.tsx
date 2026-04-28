import { KanbanColumn } from './kanban-column'
import { columns } from '../data/mock-tasks'
import type { KanbanTask } from '../types'

interface KanbanBoardProps {
  tasks: KanbanTask[]
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDrop: (columnId: string) => void
  onClickTask: (task: KanbanTask) => void
}

export function KanbanBoard({ tasks, onDragStart, onDrop, onClickTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          config={col}
          tasks={tasks.filter((t) => t.column === col.id)}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onClickTask={onClickTask}
        />
      ))}
    </div>
  )
}
