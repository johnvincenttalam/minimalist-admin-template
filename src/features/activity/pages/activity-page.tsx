import { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { LogIn, LogOut, UserPlus, Pencil, Trash2, Shield, Settings, Download } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/shared/ui/page-header'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { SearchInput } from '@/shared/ui/search-input'
import { FilterChips } from '@/shared/ui/filter-chips'
import { cn } from '@/shared/utils/cn'

type ActivityType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'permission' | 'settings'

interface Activity {
  id: string
  user: string
  type: ActivityType
  action: string
  target?: string
  timestamp: Date
  ip?: string
}

const typeConfig: Record<ActivityType, { icon: LucideIcon; bg: string; color: string; label: string }> = {
  login:      { icon: LogIn,    bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Login' },
  logout:     { icon: LogOut,   bg: 'bg-zinc-100',   color: 'text-zinc-500',    label: 'Logout' },
  create:     { icon: UserPlus, bg: 'bg-blue-50',    color: 'text-blue-600',    label: 'Create' },
  update:     { icon: Pencil,   bg: 'bg-amber-50',   color: 'text-amber-600',   label: 'Update' },
  delete:     { icon: Trash2,   bg: 'bg-red-50',     color: 'text-red-600',     label: 'Delete' },
  permission: { icon: Shield,   bg: 'bg-violet-50',  color: 'text-violet-600',  label: 'Permission' },
  settings:   { icon: Settings, bg: 'bg-zinc-100',   color: 'text-zinc-500',    label: 'Settings' },
}

function mins(n: number) { return new Date(Date.now() - n * 60 * 1000) }
function hours(n: number) { return new Date(Date.now() - n * 60 * 60 * 1000) }
function days(n: number) { return new Date(Date.now() - n * 24 * 60 * 60 * 1000) }

const mockActivities: Activity[] = [
  { id: '1', user: 'Admin User', type: 'login', action: 'Signed in', timestamp: mins(5), ip: '192.168.1.12' },
  { id: '2', user: 'Jane Doe', type: 'create', action: 'Created user', target: 'alex@example.com', timestamp: mins(42) },
  { id: '3', user: 'Admin User', type: 'permission', action: 'Updated role permissions', target: 'Editor', timestamp: hours(2) },
  { id: '4', user: 'John Smith', type: 'update', action: 'Updated profile', timestamp: hours(4) },
  { id: '5', user: 'Jane Doe', type: 'delete', action: 'Deleted user', target: 'bob@example.com', timestamp: hours(6) },
  { id: '6', user: 'Admin User', type: 'settings', action: 'Changed notification preferences', timestamp: hours(12) },
  { id: '7', user: 'John Smith', type: 'logout', action: 'Signed out', timestamp: days(1) },
  { id: '8', user: 'Jane Doe', type: 'login', action: 'Signed in', timestamp: days(1), ip: '10.0.0.42' },
  { id: '9', user: 'Admin User', type: 'create', action: 'Created role', target: 'Billing', timestamp: days(2) },
  { id: '10', user: 'Admin User', type: 'update', action: 'Updated organization', target: 'Your Company', timestamp: days(3) },
]

const filterOptions: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'login', label: 'Logins' },
  { value: 'create', label: 'Creates' },
  { value: 'update', label: 'Updates' },
  { value: 'delete', label: 'Deletes' },
  { value: 'permission', label: 'Permissions' },
  { value: 'settings', label: 'Settings' },
]

export function ActivityPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ActivityType | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return mockActivities.filter((a) => {
      if (filter !== 'all' && a.type !== filter) return false
      if (!q) return true
      return (
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        (a.target?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query, filter])

  return (
    <div>
      <PageHeader
        title="Activity Log"
        subtitle="Audit trail of all actions across your workspace"
        actions={<Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Export</Button>}
      />

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search actions, users, targets..."
            className="flex-1"
          />
          <FilterChips value={filter} onChange={setFilter} options={filterOptions} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState title="No activity found" description="Try adjusting your search or filters." />
          ) : (
            <ul>
              {filtered.map((a, i) => {
                const cfg = typeConfig[a.type]
                const Icon = cfg.icon
                return (
                  <li key={a.id} className={cn('flex items-start gap-4 px-6 py-4', i !== filtered.length - 1 && 'border-b border-zinc-100/60')}>
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
                      <Icon className={cn('w-[18px] h-[18px]', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Avatar name={a.user} size="sm" />
                        <span className="text-[13px] font-medium text-zinc-900">{a.user}</span>
                        <span className="text-[13px] text-zinc-500">{a.action.toLowerCase()}</span>
                        {a.target && <span className="text-[13px] font-medium text-zinc-700">{a.target}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[12px] text-zinc-400">
                        <Badge variant="outline" size="sm">{cfg.label}</Badge>
                        <span>{formatDistanceToNow(a.timestamp, { addSuffix: true })}</span>
                        {a.ip && <span className="font-mono">{a.ip}</span>}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
