import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { navigation } from '@/config/navigation'

/** Segment → label map built from the navigation config. */
const navLabelMap: Record<string, string> = (() => {
  const map: Record<string, string> = { admin: 'Admin' }
  for (const item of navigation) {
    const lastSegment = item.path.split('/').filter(Boolean).pop() ?? ''
    if (lastSegment) map[lastSegment] = item.label
  }
  return map
})()

function formatSegment(segment: string) {
  if (navLabelMap[segment]) return navLabelMap[segment]
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Breadcrumb({ className }: { className?: string }) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-[12px] mb-4', className)}>
      <Link to={`/${segments[0]}`} className="text-zinc-400 hover:text-zinc-600 transition-colors" aria-label="Home">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.slice(1).map((segment, i) => {
        const path = `/${segments.slice(0, i + 2).join('/')}`
        const isLast = i === segments.length - 2
        const label = formatSegment(segment)

        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            {isLast ? (
              <span className="text-zinc-700 font-medium" aria-current="page">{label}</span>
            ) : (
              <Link to={path} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
