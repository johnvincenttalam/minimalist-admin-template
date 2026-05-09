import { format, isSameMonth, isToday } from 'date-fns'
import { cn } from '@/shared/utils/cn'
import { eventTypeColor } from '../types'
import type { CalendarEvent } from '../types'

interface DayCellProps {
  date: Date
  currentMonth: Date
  events: CalendarEvent[]
  onClickDay: (date: Date) => void
  onClickEvent: (event: CalendarEvent) => void
}

export function DayCell({ date, currentMonth, events, onClickDay, onClickEvent }: DayCellProps) {
  const inMonth = isSameMonth(date, currentMonth)
  const today = isToday(date)
  const maxVisible = 3
  const overflow = events.length - maxVisible

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Add event for ${format(date, 'MMMM d, yyyy')}`}
      className={cn(
        'min-h-[100px] border-b border-r border-zinc-100 p-1.5 cursor-pointer transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-accent/30',
        !inMonth && 'bg-zinc-50/30',
      )}
      onClick={() => onClickDay(date)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClickDay(date) }
      }}
    >
      <div className="flex items-center justify-center mb-1">
        <span
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-medium',
            today && 'bg-accent text-accent-fg ring-2 ring-accent/20',
            !today && inMonth && 'text-zinc-700',
            !today && !inMonth && 'text-zinc-300',
          )}
        >
          {format(date, 'd')}
        </span>
      </div>
      <div className="space-y-0.5">
        {events.slice(0, maxVisible).map((event) => (
          <button
            key={event.id}
            onClick={(e) => {
              e.stopPropagation()
              onClickEvent(event)
            }}
            className="w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate text-white transition-opacity hover:opacity-80 block"
          >
            <span className={cn('inline-block w-full rounded px-1 py-[1px] truncate', eventTypeColor[event.type])}>
              {event.time && <span className="mr-1 opacity-80">{event.time}</span>}
              {event.title}
            </span>
          </button>
        ))}
        {overflow > 0 && (
          <p className="text-[10px] text-zinc-400 font-medium px-1.5">+{overflow} more</p>
        )}
      </div>
    </div>
  )
}
