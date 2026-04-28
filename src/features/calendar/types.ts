export type EventType = 'meeting' | 'deadline' | 'reminder' | 'event'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  time?: string
  type: EventType
}

export const eventTypeColor: Record<EventType, string> = {
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
  reminder: 'bg-amber-500',
  event: 'bg-emerald-500',
}
