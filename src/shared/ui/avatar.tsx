import { cn } from '@/shared/utils/cn'

const sizes = { sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-xs', lg: 'w-12 h-12 text-sm' }

const colors = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
  'bg-indigo-600 text-white',
  'bg-pink-500 text-white',
  'bg-teal-600 text-white',
  'bg-orange-600 text-white',
]

function hashName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash)
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'auto' | 'accent'
  className?: string
}

export function Avatar({ name, size = 'md', tone = 'auto', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const palette = tone === 'accent' ? 'bg-accent text-accent-fg' : colors[hashName(name) % colors.length]

  return (
    <div className={cn('rounded-full flex items-center justify-center font-medium', palette, sizes[size], className)}>
      {initials}
    </div>
  )
}
