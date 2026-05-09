import { useState, useMemo } from 'react'
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Card, CardContent } from '@/shared/ui/card'
import { Tabs } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { CalendarDays } from 'lucide-react'
import { CalendarGrid } from '../components/calendar-grid'
import { EventModal } from '../components/event-modal'
import { mockEvents } from '../data/mock-events'
import { eventTypeColor } from '../types'
import type { CalendarEvent, EventType } from '../types'

const viewTabs = [
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Day', value: 'day' },
]

export function CalendarPage() {
  const [events, setEvents] = useState(mockEvents)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState('month')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const navigateBack = () => {
    setCurrentMonth((d) => {
      if (view === 'week') return subWeeks(d, 1)
      if (view === 'day') return subDays(d, 1)
      return subMonths(d, 1)
    })
  }

  const navigateForward = () => {
    setCurrentMonth((d) => {
      if (view === 'week') return addWeeks(d, 1)
      if (view === 'day') return addDays(d, 1)
      return addMonths(d, 1)
    })
  }

  const headingLabel = (() => {
    if (view === 'day') return format(currentMonth, 'MMMM d, yyyy')
    if (view === 'week') {
      const ws = startOfWeek(currentMonth)
      const we = endOfWeek(currentMonth)
      return `${format(ws, 'MMM d')} – ${format(we, 'MMM d, yyyy')}`
    }
    return format(currentMonth, 'MMMM yyyy')
  })()

  const openCreate = (date?: Date) => {
    setEditingEvent(null)
    setSelectedDate(date)
    setModalOpen(true)
  }

  const openEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setSelectedDate(undefined)
    setModalOpen(true)
  }

  const saveEvent = (data: { title: string; date: Date; time?: string; type: EventType; description?: string }) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? { ...e, ...data } : e)),
      )
      toast.success('Event updated')
    } else {
      const newEvent: CalendarEvent = { id: crypto.randomUUID(), ...data }
      setEvents((prev) => [...prev, newEvent])
      toast.success('Event created')
    }
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    toast('Event deleted')
  }

  const today = new Date()

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentMonth)
    const weekEnd = endOfWeek(currentMonth)
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentMonth])

  const dayEvents = useMemo(
    () => events.filter((e) => isSameDay(e.date, currentMonth)),
    [events, currentMonth],
  )

  const weekEvents = useMemo(
    () => events.filter((e) => isSameWeek(e.date, currentMonth)),
    [events, currentMonth],
  )

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle={headingLabel}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openCreate(currentMonth)}>
            Add Event
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={navigateBack}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-zinc-900 min-w-[160px] text-center">
                {headingLabel}
              </h2>
              <button
                onClick={navigateForward}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Button
                variant="outline"
                className="ml-2 text-[12px] h-8"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
            </div>
            <Tabs items={viewTabs} value={view} onChange={setView} />
          </div>

          {view === 'month' && (
            <CalendarGrid
              currentMonth={currentMonth}
              events={events}
              onClickDay={openCreate}
              onClickEvent={openEdit}
            />
          )}

          {view === 'week' && (
            <div className="space-y-1">
              {weekDays.map((day) => {
                const dayEvts = weekEvents.filter((e) => isSameDay(e.date, day))
                return (
                  <div
                    key={day.toISOString()}
                    className="flex gap-4 py-2 border-b border-zinc-50 last:border-0"
                  >
                    <div className="w-20 flex-shrink-0 text-[12px] text-zinc-500 font-medium pt-0.5">
                      {format(day, 'EEE, MMM d')}
                    </div>
                    <div className="flex-1 space-y-1">
                      {dayEvts.length === 0 ? (
                        <p className="text-[12px] text-zinc-300 italic">No events</p>
                      ) : (
                        dayEvts.map((e) => (
                          <button
                            key={e.id}
                            onClick={() => openEdit(e)}
                            className="flex items-center gap-2 text-[12px] text-zinc-700 hover:text-zinc-900 transition-colors"
                          >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${eventTypeColor[e.type]}`} />
                            {e.time && <span className="text-zinc-400">{e.time}</span>}
                            <span>{e.title}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {view === 'day' && (
            <div className="space-y-2">
              <h3 className="text-[13px] font-medium text-zinc-700">
                {format(currentMonth, 'EEEE, MMMM d, yyyy')}
                {isSameDay(currentMonth, today) && (
                  <span className="ml-2 text-[11px] text-accent font-semibold">Today</span>
                )}
              </h3>
              {dayEvents.length === 0 ? (
                <EmptyState icon={CalendarDays} title="No events for this day" description="Create one to fill it in." />
              ) : (
                dayEvents.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => openEdit(e)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${eventTypeColor[e.type]}`} />
                    <div>
                      <p className="text-[13px] font-medium text-zinc-900">{e.title}</p>
                      {e.time && <p className="text-[12px] text-zinc-400">{e.time}</p>}
                      {e.description && <p className="text-[12px] text-zinc-500 mt-0.5">{e.description}</p>}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={editingEvent}
        defaultDate={selectedDate}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </div>
  )
}
