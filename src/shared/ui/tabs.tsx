import { cn } from '@/shared/utils/cn'

interface TabItem {
  label: string
  value: string
  count?: number
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 border-b border-zinc-100', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'px-3 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px cursor-pointer',
            value === item.value
              ? 'border-accent text-accent'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className={cn(
              'ml-1.5 min-w-[20px] inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold',
              value === item.value
                ? 'bg-accent text-accent-fg'
                : 'bg-zinc-200/60 text-zinc-500'
            )}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
