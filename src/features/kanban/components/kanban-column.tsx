import { useRef, useState } from 'react'
import { cn } from '@/shared/utils/cn'
import { KanbanCard } from './kanban-card'
import type { KanbanTask, ColumnConfig } from '../types'

interface KanbanColumnProps {
  config: ColumnConfig
  tasks: KanbanTask[]
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDrop: (columnId: string) => void
  onClickTask: (task: KanbanTask) => void
}

export function KanbanColumn({ config, tasks, onDragStart, onDrop, onClickTask }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounter = useRef(0)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragOver(false)
    onDrop(config.id)
  }

  return (
    <div
      className={cn(
        'flex-shrink-0 w-72 flex flex-col rounded-xl bg-zinc-50/50 border border-zinc-100 transition-colors',
        isDragOver && 'border-accent bg-accent/5',
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 px-3 py-3 border-b border-zinc-100">
        <span className={cn('w-2.5 h-2.5 rounded-full', config.color)} />
        <h3 className="text-[13px] font-semibold text-zinc-700">{config.label}</h3>
        <span className="text-[11px] font-medium text-zinc-400 bg-zinc-200/50 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onClick={onClickTask}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-[12px] text-zinc-300 text-center py-8 italic">No tasks</p>
        )}
      </div>
    </div>
  )
}
