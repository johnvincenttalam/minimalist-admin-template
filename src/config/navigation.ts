import {
  LayoutDashboard,
  BarChart3,
  Table2,
  FileText,
  Users,
  KeyRound,
  Activity,
  Bell,
  CalendarDays,
  Columns3,
  Map as MapIcon,
  UserCircle,
  Palette,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { FeatureKey } from './features'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  feature: FeatureKey
  divider?: boolean
}

export const navigation: NavItem[] = [
  { label: 'Dashboard', path: '/admin',          icon: LayoutDashboard, feature: 'dashboard' },
  { label: 'Charts',    path: '/admin/charts',   icon: BarChart3,       feature: 'charts' },
  { label: 'Table',     path: '/admin/table',    icon: Table2,          feature: 'table' },
  { label: 'Forms',     path: '/admin/forms',    icon: FileText,        feature: 'forms' },
  { label: 'Users',     path: '/admin/users',    icon: Users,           feature: 'users' },
  { label: 'Roles',     path: '/admin/roles',    icon: KeyRound,        feature: 'roles' },
  { label: 'Activity',       path: '/admin/activity',       icon: Activity,     feature: 'activity' },
  { label: 'Notifications', path: '/admin/notifications',  icon: Bell,         feature: 'notifications' },
  { label: 'Calendar',      path: '/admin/calendar',       icon: CalendarDays, feature: 'calendar' },
  { label: 'Kanban',        path: '/admin/kanban',         icon: Columns3,     feature: 'kanban' },
  { label: 'Map',           path: '/admin/map',            icon: MapIcon,      feature: 'map' },
  { label: 'Profile',       path: '/admin/profile',        icon: UserCircle,   feature: 'profile',  divider: true },
  { label: 'UI Kit',    path: '/admin/ui-kit',   icon: Palette,         feature: 'uiKit' },
  { label: 'Settings',  path: '/admin/settings', icon: Settings,        feature: 'settings' },
]
