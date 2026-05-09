import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { Popover } from './popover'
import { MenuItem } from './menu'
import { Button } from './button'
import { cn } from '@/shared/utils/cn'

export interface SelectMenuOption<T extends string> {
  value: T
  label: string
}

interface SelectMenuProps<T extends string> {
  value: T | ''
  onChange: (value: T | '') => void
  options: SelectMenuOption<T>[]
  placeholder: string
  icon?: LucideIcon
  width?: string
  align?: 'left' | 'right'
  className?: string
}

export function SelectMenu<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  width = 'w-52',
  align = 'left',
  className,
}: SelectMenuProps<T>) {
  const selected = options.find((o) => o.value === value)
  const triggerLabel = selected?.label ?? placeholder

  return (
    <Popover
      align={align}
      width={width}
      panelClassName="py-1"
      trigger={({ toggle }) => (
        <Button
          variant="outline"
          leftIcon={Icon ? <Icon className="w-4 h-4" /> : undefined}
          onClick={toggle}
          className={cn('capitalize', className)}
        >
          {triggerLabel}
        </Button>
      )}
    >
      {({ close }) => (
        <>
          <MenuItem
            leading={value === '' ? <Check className="w-4 h-4 text-accent" /> : <span className="w-4 h-4" />}
            onClick={() => { onChange(''); close() }}
          >
            {placeholder}
          </MenuItem>
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              leading={opt.value === value ? <Check className="w-4 h-4 text-accent" /> : <span className="w-4 h-4" />}
              onClick={() => { onChange(opt.value); close() }}
              className="capitalize"
            >
              {opt.label}
            </MenuItem>
          ))}
        </>
      )}
    </Popover>
  )
}
