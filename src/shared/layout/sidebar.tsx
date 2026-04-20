import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { navigation } from '@/config/navigation'
import { isFeatureEnabled } from '@/config/features'
import { prefetchFeature } from '@/config/feature-imports'
import { appConfig } from '@/config/app'

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const location = useLocation()
  const Logo = appConfig.logo

  const items = useMemo(() => navigation.filter((item) => isFeatureEnabled(item.feature)), [])

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-sidebar z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-white/[0.06]',
          collapsed ? 'w-[68px]' : 'w-[240px]',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Logo className="w-4 h-4 text-zinc-900" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-semibold text-[15px] tracking-tight whitespace-nowrap"
              >
                {appConfig.shortName}
              </motion.span>
            )}
          </div>
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="ml-auto lg:hidden text-sidebar-text hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path)

            return (
              <div key={item.path}>
                {item.divider && <div className="border-t border-white/[0.06] my-2" />}
                <NavLink
                  to={item.path}
                  onClick={onCloseMobile}
                  onMouseEnter={() => prefetchFeature(item.feature)}
                  onFocus={() => prefetchFeature(item.feature)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                  )}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              </div>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="hidden lg:flex p-3 border-t border-white/[0.06]">
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-colors text-[13px]"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
