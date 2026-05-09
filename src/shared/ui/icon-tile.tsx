import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type IconTileSize = 'sm' | 'md' | 'lg'
type IconTileTone = 'zinc' | 'blue' | 'emerald' | 'amber' | 'red' | 'violet' | 'indigo' | 'orange' | 'cyan' | 'purple'

interface IconTileProps {
  icon: LucideIcon
  size?: IconTileSize
  tone?: IconTileTone
  className?: string
}

const sizeClasses: Record<IconTileSize, { box: string; icon: string }> = {
  sm: { box: 'w-8 h-8 rounded-lg',   icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10 rounded-lg', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12 rounded-xl', icon: 'w-5 h-5' },
}

const toneClasses: Record<IconTileTone, string> = {
  zinc:    'bg-zinc-100 text-zinc-500',
  blue:    'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber:   'bg-amber-50 text-amber-600',
  red:     'bg-red-50 text-red-600',
  violet:  'bg-violet-50 text-violet-600',
  indigo:  'bg-indigo-50 text-indigo-600',
  orange:  'bg-orange-50 text-orange-600',
  cyan:    'bg-cyan-50 text-cyan-600',
  purple:  'bg-purple-50 text-purple-600',
}

export function IconTile({ icon: Icon, size = 'md', tone = 'zinc', className }: IconTileProps) {
  const s = sizeClasses[size]
  return (
    <div className={cn('flex items-center justify-center flex-shrink-0', s.box, toneClasses[tone], className)}>
      <Icon className={s.icon} />
    </div>
  )
}
