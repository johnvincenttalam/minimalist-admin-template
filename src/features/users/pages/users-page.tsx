import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Plus, Users, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { exportToCSV } from '@/shared/utils/export-csv'
import { useUsers } from '@/features/users'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/features/users/types'
import { TableSkeleton } from '@/shared/ui/table-skeleton'
import { toast } from 'sonner'
import { RowActions } from '@/shared/ui/row-actions'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { StatusBadge } from '@/shared/ui/status-badge'
import { SearchInput } from '@/shared/ui/search-input'

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Select a role'),
  phone: z.string().min(7, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type UserForm = z.infer<typeof userSchema>

export function UsersPage() {
  const { data: users = [], isLoading } = useUsers()
  const [globalFilter, setGlobalFilter] = useState('')
  const [showModal, setShowModal] = useState(false)

  const columns = useMemo<ColumnDef<User>[]>(() => [
    { accessorKey: 'name', header: 'User', cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.original.name} size="sm" />
        <div><p className="font-medium text-zinc-900">{row.original.name}</p><p className="text-xs text-zinc-400">{row.original.email}</p></div>
      </div>
    )},
    { accessorKey: 'role', header: 'Role', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue() as string} /> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM dd, yyyy') },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <RowActions
          onView={() => toast.info('View details coming soon')}
          onEdit={() => toast.info('Edit coming soon')}
          onDelete={() => {}}
        />
      ),
    },
  ], [])

  const table = useReactTable({
    data: users, columns, state: { globalFilter }, onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(),
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserForm>({ resolver: zodResolver(userSchema) })

  const onSubmit = (_data: UserForm) => {
    setShowModal(false)
    reset()
    toast.success('User added successfully')
  }

  if (isLoading) return (
    <div>
      <PageHeader title="Users" subtitle="Loading..." />
      <TableSkeleton columns={6} rows={8} />
    </div>
  )

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} system users`} actions={
        <>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => exportToCSV(users, 'users', [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Created' },
          ])}>
            Export
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Add User</Button>
        </>
      } />
      <div className="mb-4 max-w-sm">
        <SearchInput value={globalFilter} onChange={setGlobalFilter} placeholder="Search users..." />
      </div>
      <div className="bg-white rounded-xl border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-zinc-50/50">{table.getHeaderGroups().map(hg => hg.headers.map(h => <th key={h.id} className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr></thead>
            <tbody>
              {table.getRowModel().rows.map(row => <tr key={row.id} className="border-b border-zinc-100/60 hover:bg-zinc-50/50">{row.getVisibleCells().map(cell => <td key={cell.id} className="px-4 py-3 text-sm text-zinc-600">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-10 h-10 text-zinc-300 mb-3" />
                      <p className="text-sm text-zinc-500">No results found</p>
                      <p className="text-xs text-zinc-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200/60">
          <p className="text-sm text-zinc-500">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</p>
          <div className="flex gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px]" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-xl border border-zinc-200/60 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center"><Users className="w-5 h-5 text-zinc-500" /></div>
                  <h2 className="text-sm font-semibold text-zinc-900">Add User</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600 text-xl">&times;</button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1"><label className="text-[13px] font-medium text-zinc-700">Name *</label><input {...register('name')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}</div>
                  <div className="col-span-2 space-y-1"><label className="text-[13px] font-medium text-zinc-700">Email *</label><input type="email" {...register('email')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}</div>
                  <div className="space-y-1"><label className="text-[13px] font-medium text-zinc-700">Role *</label><select {...register('role')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400"><option value="">Select</option><option value="admin">Admin</option></select>{errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}</div>
                  <div className="space-y-1"><label className="text-[13px] font-medium text-zinc-700">Phone *</label><input {...register('phone')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}</div>
                  <div className="col-span-2 space-y-1"><label className="text-[13px] font-medium text-zinc-700">Password *</label><input type="password" {...register('password')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}</div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" fullWidth>Add User</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
