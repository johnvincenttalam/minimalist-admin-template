import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns'
import { DayCell } from './day-cell'
import type { CalendarEvent } from '../types'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  currentMonth: Date
  events: CalendarEvent[]
  onClickDay: (date: Date) => void
  onClickEvent: (event: CalendarEvent) => void
}

export function CalendarGrid({ currentMonth, events, onClickDay, onClickEvent }: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-zinc-200">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[11px] font-semibold text-zinc-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-t border-zinc-100">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(e.date, day))
          return (
            <DayCell
              key={day.toISOString()}
              date={day}
              currentMonth={currentMonth}
              events={dayEvents}
              onClickDay={onClickDay}
              onClickEvent={onClickEvent}
            />
          )
        })}
      </div>
    </div>
  )
}
