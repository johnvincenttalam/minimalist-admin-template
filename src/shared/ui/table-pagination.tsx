import type { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type Mode = 'simple' | 'full'

interface TablePaginationProps<TData> {
  table: Table<TData>
  mode?: Mode
  pageSizes?: number[]
  className?: string
}

const navBtn = 'p-2 rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 transition-colors'

export function TablePagination<TData>({
  table,
  mode = 'simple',
  pageSizes = [10, 20, 50, 100],
  className,
}: TablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex
  const rowCount = table.getFilteredRowModel().rows.length

  if (mode === 'simple') {
    return (
      <div className={cn('flex items-center justify-between px-4 py-3 border-t border-zinc-200/60', className)}>
        <p className="text-sm text-zinc-500">Page {pageIndex + 1} of {pageCount || 1}</p>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className={navBtn} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className={navBtn} aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-zinc-100', className)}>
      <div className="flex items-center gap-4">
        <span className="text-[12px] text-zinc-500">
          Page {pageIndex + 1} of {pageCount || 1}
          {' · '}
          {rowCount} rows
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-8 px-2 text-xs border border-zinc-200 rounded-md bg-white focus:outline-none"
          aria-label="Rows per page"
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} className={navBtn} aria-label="First page">
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className={navBtn} aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className={navBtn} aria-label="Next page">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} className={navBtn} aria-label="Last page">
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
