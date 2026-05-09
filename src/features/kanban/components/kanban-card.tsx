import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Badge } from '@/shared/ui/badge'
import { Avatar } from '@/shared/ui/avatar'
import type { KanbanTask, TaskPriority } from '../types'

const priorityVariant: Record<TaskPriority, 'default' | 'success' | 'warning' | 'danger'> = {
  low: 'default',
  medium: 'success',
  high: 'warning',
  urgent: 'danger',
}

const priorityLabel: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

interface KanbanCardProps {
  task: KanbanTask
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onClick: (task: KanbanTask) => void
}

export function KanbanCard({ task, onDragStart, onClick }: KanbanCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open task: ${task.title}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(task) }
      }}
      className={cn(
        'p-3 bg-white rounded-lg border border-zinc-200/60 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-accent/30',
        'hover:border-zinc-300 hover:shadow-sm transition-all',
      )}
    >
      <p className="text-[13px] font-medium text-zinc-900 mb-1.5">{task.title}</p>
      {task.description && (
        <p className="text-[12px] text-zinc-400 line-clamp-2 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <Badge variant={priorityVariant[task.priority]} size="sm">
          {priorityLabel[task.priority]}
        </Badge>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Calendar className="w-3 h-3" />
              {format(task.dueDate, 'MMM d')}
            </span>
          )}
          {task.assignee && <Avatar name={task.assignee} size="sm" className="w-6 h-6 text-[9px]" />}
        </div>
      </div>
    </div>
  )
}
