import { useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Plus, Users, Download } from 'lucide-react'
import { exportToCSV } from '@/shared/utils/export-csv'
import { useUsers } from '@/features/users'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@/features/users/types'
import { TableSkeleton } from '@/shared/ui/table-skeleton'
import { toast } from 'sonner'
import { RowActions } from '@/shared/ui/row-actions'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { StatusBadge } from '@/shared/ui/status-badge'
import { SearchInput } from '@/shared/ui/search-input'
import { Modal } from '@/shared/ui/modal'
import { EmptyState } from '@/shared/ui/empty-state'
import { TablePagination } from '@/shared/ui/table-pagination'

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
            <thead><tr className="bg-zinc-50/50">{table.getHeaderGroups().map(hg => hg.headers.map(h => <th key={h.id} className="px-4 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{flexRender(h.column.columnDef.header, h.getContext())}</th>))}</tr></thead>
            <tbody>
              {table.getRowModel().rows.map(row => <tr key={row.id} className="border-b border-zinc-100/60 hover:bg-zinc-50">{row.getVisibleCells().map(cell => <td key={cell.id} className="px-4 py-3 text-sm text-zinc-600">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    <EmptyState icon={Users} title="No results found" description="Try adjusting your search or filters" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination table={table} mode="simple" />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add User">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1"><label htmlFor="user-name" className="text-[13px] font-medium text-zinc-700">Name *</label><input id="user-name" {...register('name')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}</div>
            <div className="col-span-2 space-y-1"><label htmlFor="user-email" className="text-[13px] font-medium text-zinc-700">Email *</label><input id="user-email" type="email" {...register('email')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}</div>
            <div className="space-y-1"><label htmlFor="user-role" className="text-[13px] font-medium text-zinc-700">Role *</label><select id="user-role" {...register('role')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400"><option value="">Select</option><option value="admin">Admin</option></select>{errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}</div>
            <div className="space-y-1"><label htmlFor="user-phone" className="text-[13px] font-medium text-zinc-700">Phone *</label><input id="user-phone" {...register('phone')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}</div>
            <div className="col-span-2 space-y-1"><label htmlFor="user-password" className="text-[13px] font-medium text-zinc-700">Password *</label><input id="user-password" type="password" {...register('password')} className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400" />{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}</div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" fullWidth>Add User</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
