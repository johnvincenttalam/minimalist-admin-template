import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, UserPlus, AlertTriangle, CheckCircle2, Info, Clock, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { IconTile } from '@/shared/ui/icon-tile'
import { Popover } from '@/shared/ui/popover'

interface Notification {
  id: string
  icon: LucideIcon
  title: string
  description: string
  time: string
  read: boolean
  type: 'info' | 'warning' | 'success' | 'danger'
}

const mockNotifications: Notification[] = [
  { id: '1', icon: UserPlus, title: 'New user registered', description: 'Jane Doe created an account', time: '5 min ago', read: false, type: 'info' },
  { id: '2', icon: AlertTriangle, title: 'System alert', description: 'High CPU usage detected on server', time: '15 min ago', read: false, type: 'warning' },
  { id: '3', icon: CheckCircle2, title: 'Backup completed', description: 'Daily database backup finished successfully', time: '1 hour ago', read: true, type: 'success' },
  { id: '4', icon: Info, title: 'Scheduled maintenance', description: 'System maintenance planned for this weekend', time: '3 hours ago', read: true, type: 'info' },
]

const typeDot: Record<string, string> = {
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  danger: 'bg-red-500',
}

const typeTone: Record<string, 'blue' | 'amber' | 'emerald' | 'red'> = {
  info: 'blue',
  warning: 'amber',
  success: 'emerald',
  danger: 'red',
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <Popover
      align="right"
      width="w-80 sm:w-96"
      trigger={({ open, toggle }) => (
        <button
          onClick={toggle}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          aria-expanded={open}
          className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      )}
    >
      {({ close }) => (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded-full">{unreadCount}</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[12px] text-zinc-500 hover:text-zinc-700 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(n => (
              <div
                key={n.id}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 border-b border-zinc-50 transition-colors hover:bg-zinc-50',
                  !n.read && 'bg-zinc-50/30'
                )}
              >
                <IconTile icon={n.icon} size="sm" tone={typeTone[n.type]} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn('text-[13px] truncate', n.read ? 'text-zinc-600' : 'font-medium text-zinc-900')}>
                      {n.title}
                    </p>
                    {!n.read && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', typeDot[n.type])} />}
                  </div>
                  <p className="text-[12px] text-zinc-400 truncate mt-0.5">{n.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-zinc-300" />
                    <span className="text-[11px] text-zinc-400">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-zinc-100 text-center">
            <Link
              to="/admin/notifications"
              onClick={close}
              className="text-[12px] font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </>
      )}
    </Popover>
  )
}
