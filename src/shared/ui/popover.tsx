import { useRef, useState, useCallback, type ReactNode } from 'react'
import { useClickOutside } from '@/shared/hooks/use-click-outside'
import { cn } from '@/shared/utils/cn'

type PopoverAlign = 'left' | 'right'

interface PopoverProps {
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode
  children: ReactNode | ((state: { close: () => void }) => ReactNode)
  align?: PopoverAlign
  width?: string
  panelClassName?: string
}

const alignClasses: Record<PopoverAlign, string> = {
  left:  'left-0',
  right: 'right-0',
}

export function Popover({
  trigger,
  children,
  align = 'right',
  width = 'w-52',
  panelClassName,
}: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setOpen((o) => !o), [])
  const close = useCallback(() => setOpen(false), [])

  useClickOutside(ref, close, open)

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle })}
      {open && (
        <div
          className={cn(
            'absolute top-full mt-1.5 bg-white rounded-xl border border-zinc-200/60 z-50 overflow-hidden',
            alignClasses[align],
            width,
            panelClassName,
          )}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}
