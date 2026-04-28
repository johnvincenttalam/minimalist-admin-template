import { useState, useMemo, useRef } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Card, CardContent } from '@/shared/ui/card'
import { SearchInput } from '@/shared/ui/search-input'
import { Button } from '@/shared/ui/button'
import { KanbanBoard } from '../components/kanban-board'
import { TaskModal } from '../components/task-modal'
import { mockTasks, columns } from '../data/mock-tasks'
import type { KanbanTask, KanbanColumn, TaskPriority } from '../types'

export function KanbanPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const draggedTaskId = useRef<string | null>(null)

  const filtered = useMemo(() => {
    if (!query) return tasks
    const q = query.toLowerCase()
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assignee?.toLowerCase().includes(q),
    )
  }, [tasks, query])

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', taskId)
    draggedTaskId.current = taskId
  }

  const handleDrop = (columnId: string) => {
    const taskId = draggedTaskId.current
    if (!taskId) return
    draggedTaskId.current = null

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.column === columnId) return

    const targetCol = columns.find((c) => c.id === columnId)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: columnId as KanbanColumn } : t)),
    )
    toast.success(`Moved to ${targetCol?.label ?? columnId}`)
  }

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task: KanbanTask) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const saveTask = (data: { title: string; description?: string; priority: TaskPriority; column: KanbanColumn; assignee?: string; dueDate?: Date }) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t)),
      )
      toast.success('Task updated')
    } else {
      const newTask: KanbanTask = { id: crypto.randomUUID(), ...data }
      setTasks((prev) => [...prev, newTask])
      toast.success('Task created')
    }
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast('Task deleted')
  }

  return (
    <div>
      <PageHeader
        title="Kanban Board"
        subtitle="Drag and drop tasks between columns to update their status"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Add Task
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <SearchInput value={query} onChange={setQuery} placeholder="Search tasks..." className="max-w-sm" />
        </CardContent>
      </Card>

      <KanbanBoard
        tasks={filtered}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onClickTask={openEdit}
      />

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        onSave={saveTask}
        onDelete={deleteTask}
      />
    </div>
  )
}
