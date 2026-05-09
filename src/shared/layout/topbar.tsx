import { cn } from '@/shared/utils/cn'
import { Menu, Search, LogOut, User, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/features/auth/store/auth-store'
import { useTheme } from '@/shared/stores/theme-store'
import { NotificationCenter } from '@/shared/layout/notification-center'
import { Avatar } from '@/shared/ui/avatar'
import { Popover } from '@/shared/ui/popover'
import { MenuItem } from '@/shared/ui/menu'
import { useNavigate } from 'react-router-dom'

interface TopbarProps {
  sidebarCollapsed: boolean
  onToggleMobileSidebar: () => void
}

export function Topbar({ sidebarCollapsed, onToggleMobileSidebar }: TopbarProps) {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-white border-b border-zinc-100 z-30 flex items-center px-4 lg:px-6 transition-all duration-300',
        sidebarCollapsed ? 'lg:left-[68px]' : 'lg:left-[240px]',
        'left-0'
      )}
    >
      <button
        onClick={onToggleMobileSidebar}
        aria-label="Open navigation menu"
        className="lg:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            autoComplete="off"
            name="topbar-search-nofill"
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Profile */}
        <Popover
          align="right"
          width="w-52"
          panelClassName="py-1.5"
          trigger={({ open, toggle }) => (
            <button
              onClick={toggle}
              aria-label="Open profile menu"
              aria-expanded={open}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <Avatar name={user?.name ?? 'User'} size="sm" tone="accent" className="w-7 h-7" />
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-medium text-zinc-700 leading-tight">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-[11px] text-zinc-400 capitalize">{user?.role ?? 'admin'}</p>
              </div>
            </button>
          )}
        >
          {({ close }) => (
            <>
              <div className="px-3 py-2 border-b border-zinc-100">
                <p className="text-[13px] font-medium text-zinc-700">{user?.name}</p>
                <p className="text-[11px] text-zinc-400">{user?.email}</p>
              </div>
              <MenuItem icon={User} onClick={() => { close(); navigate('/admin/settings') }}>
                Profile Settings
              </MenuItem>
              <MenuItem icon={LogOut} tone="danger" onClick={handleLogout}>
                Sign Out
              </MenuItem>
            </>
          )}
        </Popover>
      </div>
    </header>
  )
}
