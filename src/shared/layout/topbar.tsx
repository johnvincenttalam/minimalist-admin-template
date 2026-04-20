import { cn } from '@/shared/utils/cn'
import { Menu, Search, LogOut, User, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useThemeStore } from '@/shared/stores/theme-store'
import { NotificationCenter } from '@/shared/layout/notification-center'
import { useClickOutside } from '@/shared/hooks/use-click-outside'
import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'

interface TopbarProps {
  sidebarCollapsed: boolean
  onToggleMobileSidebar: () => void
}

export function Topbar({ sidebarCollapsed, onToggleMobileSidebar }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const { theme, toggle: toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useClickOutside(profileRef, () => setShowProfile(false), showProfile)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

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
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            aria-label="Open profile menu"
            aria-expanded={showProfile}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-[11px] font-medium">
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-medium text-zinc-700 leading-tight">
                {user?.name ?? 'User'}
              </p>
              <p className="text-[11px] text-zinc-400 capitalize">{user?.role ?? 'admin'}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-zinc-200/60 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-zinc-100">
                <p className="text-[13px] font-medium text-zinc-700">{user?.name}</p>
                <p className="text-[11px] text-zinc-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setShowProfile(false); navigate('/admin/settings') }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
