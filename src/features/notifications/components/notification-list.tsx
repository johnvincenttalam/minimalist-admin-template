import { isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Trash2, Info, AlertTriangle, CheckCheck, AlertOctagon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Notification, NotificationType } from '../types'

const typeIcon: Record<NotificationType, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: AlertOctagon,
}

const typeIconBg: Record<NotificationType, string> = {
  info: 'bg-blue-50',
  warning: 'bg-amber-50',
  success: 'bg-emerald-50',
  danger: 'bg-red-50',
}

const typeIconColor: Record<NotificationType, string> = {
  info: 'text-blue-600',
  warning: 'text-amber-500',
  success: 'text-emerald-600',
  danger: 'text-red-500',
}

const typeDot: Record<NotificationType, string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  danger: 'bg-red-500',
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

function groupByDate(items: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = []
  const today: Notification[] = []
  const yesterday: Notification[] = []
  const earlier: Notification[] = []

  for (const item of items) {
    if (isToday(item.createdAt)) today.push(item)
    else if (isYesterday(item.createdAt)) yesterday.push(item)
    else earlier.push(item)
  }

  if (today.length > 0) groups.push({ label: 'Today', items: today })
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', items: yesterday })
  if (earlier.length > 0) groups.push({ label: 'Earlier', items: earlier })

  return groups
}

export function NotificationList({ notifications, onMarkRead, onDelete }: NotificationListProps) {
  const groups = groupByDate(notifications)

  return (
    <div className="divide-y divide-zinc-100">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="px-4 py-2 bg-zinc-50/50">
            <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{group.label}</h3>
          </div>
          <AnimatePresence initial={false}>
            {group.items.map((n) => {
              const Icon = typeIcon[n.type]
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-zinc-50 transition-colors hover:bg-zinc-50/50 group',
                    !n.read && 'bg-zinc-50/30'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', typeIconBg[n.type])}>
                    <Icon className={cn('w-4 h-4', typeIconColor[n.type])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-[13px] truncate', n.read ? 'text-zinc-600' : 'font-medium text-zinc-900')}>
                        {n.title}
                      </p>
                      {!n.read && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', typeDot[n.type])} />}
                    </div>
                    <p className="text-[12px] text-zinc-400 truncate mt-0.5">{n.description}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => onMarkRead(n.id)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(n.id)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
