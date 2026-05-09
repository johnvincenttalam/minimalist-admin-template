import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { IconTile } from './icon-tile'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {Icon && <IconTile icon={Icon} size="lg" tone="zinc" className="mb-4" />}
      <h3 className="text-sm font-medium text-zinc-700 mb-1">{title}</h3>
      {description && <p className="text-[13px] text-zinc-400 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
