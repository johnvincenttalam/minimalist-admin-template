import { useState, useMemo } from 'react'
import { CheckCheck, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Card, CardContent } from '@/shared/ui/card'
import { SearchInput } from '@/shared/ui/search-input'
import { FilterChips } from '@/shared/ui/filter-chips'
import { Tabs } from '@/shared/ui/tabs'
import { EmptyState } from '@/shared/ui/empty-state'
import { Button } from '@/shared/ui/button'
import { NotificationList } from '../components/notification-list'
import { mockNotifications } from '../data/mock-notifications'
import type { NotificationType } from '../types'

type TypeFilter = NotificationType | 'all'

const typeFilterOptions: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'danger', label: 'Danger' },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [tab, setTab] = useState('all')

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const filtered = useMemo(() => {
    let result = notifications

    if (tab === 'unread') result = result.filter((n) => !n.read)

    if (typeFilter !== 'all') result = result.filter((n) => n.type === typeFilter)

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q),
      )
    }

    return result
  }, [notifications, query, typeFilter, tab])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast('Notification deleted')
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay on top of what's happening across your workspace"
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search notifications..." className="flex-1" />
          <FilterChips value={typeFilter} onChange={setTypeFilter} options={typeFilterOptions} />
        </CardContent>
      </Card>

      <Card>
        <Tabs
          items={[
            { label: 'All', value: 'all', count: notifications.length },
            { label: 'Unread', value: 'unread', count: unreadCount },
          ]}
          value={tab}
          onChange={setTab}
          className="px-4"
        />
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications found"
              description="Try adjusting your search or filter to find what you're looking for"
            />
          ) : (
            <NotificationList notifications={filtered} onMarkRead={markRead} onDelete={deleteNotification} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
