import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Modal } from '@/shared/ui/modal'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Select } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import type { KanbanTask, KanbanColumn, TaskPriority } from '../types'

const priorities = ['low', 'medium', 'high', 'urgent'] as const
const columnIds = ['backlog', 'in-progress', 'review', 'done'] as const

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(priorities, { message: 'Select a priority' }),
  column: z.enum(columnIds, { message: 'Select a column' }),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

const columnOptions = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
]

const assigneeOptions = [
  { label: 'Unassigned', value: '' },
  { label: 'Alex Chen', value: 'Alex Chen' },
  { label: 'Sarah Miller', value: 'Sarah Miller' },
  { label: 'Jordan Lee', value: 'Jordan Lee' },
]

interface TaskModalProps {
  open: boolean
  onClose: () => void
  task?: KanbanTask | null
  onSave: (data: { title: string; description?: string; priority: TaskPriority; column: KanbanColumn; assignee?: string; dueDate?: Date }) => void
  onDelete?: (id: string) => void
}

export function TaskModal({ open, onClose, task, onSave, onDelete }: TaskModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      column: 'backlog',
      assignee: '',
      dueDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (task) {
        form.reset({
          title: task.title,
          description: task.description ?? '',
          priority: task.priority,
          column: task.column,
          assignee: task.assignee ?? '',
          dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
        })
      } else {
        form.reset({
          title: '',
          description: '',
          priority: 'medium',
          column: 'backlog',
          assignee: '',
          dueDate: '',
        })
      }
    }
  }, [open, task, form])

  const onSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      description: values.description || undefined,
      priority: values.priority,
      column: values.column,
      assignee: values.assignee || undefined,
      dueDate: values.dueDate ? new Date(values.dueDate + 'T00:00:00') : undefined,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
      footer={
        <>
          {task && onDelete && (
            <Button
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => { onDelete(task.id); onClose() }}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Task title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
        />
        <Textarea
          label="Description (optional)"
          rows={3}
          placeholder="Add a description..."
          {...form.register('description')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={priorityOptions}
            {...form.register('priority')}
            error={form.formState.errors.priority?.message}
          />
          <Select
            label="Column"
            options={columnOptions}
            {...form.register('column')}
            error={form.formState.errors.column?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Assignee"
            options={assigneeOptions}
            {...form.register('assignee')}
          />
          <Input
            label="Due Date (optional)"
            type="date"
            {...form.register('dueDate')}
          />
        </div>
      </form>
    </Modal>
  )
}
