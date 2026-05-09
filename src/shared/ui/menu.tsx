import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type MenuItemTone = 'default' | 'danger'
type MenuItemDensity = 'default' | 'compact'

interface MenuItemProps {
  icon?: LucideIcon
  leading?: React.ReactNode
  tone?: MenuItemTone
  density?: MenuItemDensity
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

const toneClasses: Record<MenuItemTone, string> = {
  default: 'text-zinc-600 hover:bg-zinc-50',
  danger:  'text-red-600 hover:bg-red-50',
}

const densityClasses: Record<MenuItemDensity, { padY: string; iconSize: string }> = {
  default: { padY: 'py-2',   iconSize: 'w-4 h-4' },
  compact: { padY: 'py-1.5', iconSize: 'w-3.5 h-3.5' },
}

export function MenuItem({
  icon: Icon,
  leading,
  tone = 'default',
  density = 'default',
  onClick,
  disabled,
  children,
  className,
}: MenuItemProps) {
  const d = densityClasses[density]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 text-[13px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        d.padY,
        toneClasses[tone],
        className,
      )}
    >
      {leading ?? (Icon && <Icon className={d.iconSize} />)}
      {children}
    </button>
  )
}

export function MenuDivider() {
  return <div className="my-1 border-t border-zinc-100" />
}
