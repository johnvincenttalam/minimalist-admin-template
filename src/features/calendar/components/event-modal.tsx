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
import type { CalendarEvent, EventType } from '../types'

const eventTypes = ['meeting', 'deadline', 'reminder', 'event'] as const

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  type: z.enum(eventTypes, { message: 'Select an event type' }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const typeOptions = [
  { label: 'Meeting', value: 'meeting' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Reminder', value: 'reminder' },
  { label: 'Event', value: 'event' },
]

interface EventModalProps {
  open: boolean
  onClose: () => void
  event?: CalendarEvent | null
  defaultDate?: Date
  onSave: (data: { title: string; date: Date; time?: string; type: EventType; description?: string }) => void
  onDelete?: (id: string) => void
}

export function EventModal({ open, onClose, event, defaultDate, onSave, onDelete }: EventModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      date: '',
      time: '',
      type: 'meeting',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (event) {
        form.reset({
          title: event.title,
          date: format(event.date, 'yyyy-MM-dd'),
          time: event.time ?? '',
          type: event.type,
          description: event.description ?? '',
        })
      } else {
        form.reset({
          title: '',
          date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '',
          time: '',
          type: 'meeting',
          description: '',
        })
      }
    }
  }, [open, event, defaultDate, form])

  const onSubmit = (values: FormValues) => {
    onSave({
      title: values.title,
      date: new Date(values.date + 'T00:00:00'),
      time: values.time || undefined,
      type: values.type,
      description: values.description || undefined,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={event ? 'Edit Event' : 'New Event'}
      footer={
        <>
          {event && onDelete && (
            <Button
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => { onDelete(event.id); onClose() }}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {event ? 'Save Changes' : 'Create Event'}
          </Button>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Event title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            {...form.register('date')}
            error={form.formState.errors.date?.message}
          />
          <Input
            label="Time (optional)"
            type="time"
            {...form.register('time')}
          />
        </div>
        <Select
          label="Type"
          options={typeOptions}
          {...form.register('type')}
          error={form.formState.errors.type?.message}
        />
        <Textarea
          label="Description (optional)"
          rows={3}
          placeholder="Add a description..."
          {...form.register('description')}
        />
      </form>
    </Modal>
  )
}
