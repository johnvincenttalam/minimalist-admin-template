import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from '@/shared/layout/sidebar'
import { Topbar } from '@/shared/layout/topbar'
import { Breadcrumb } from '@/shared/ui/breadcrumb'
import { useLocalStorageState } from '@/shared/hooks/use-local-storage-state'
import { cn } from '@/shared/utils/cn'

export function AdminLayout() {
  const [collapsed, setCollapsed] = useLocalStorageState('sidebar-collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Topbar
        sidebarCollapsed={collapsed}
        onToggleMobileSidebar={() => setMobileOpen(true)}
      />
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          collapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]'
        )}
      >
        <div className="p-6 lg:p-8">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
