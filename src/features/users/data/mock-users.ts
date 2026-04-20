import type { User } from '@/features/users/types'

export const mockUsers: User[] = [
  { id: 'U001', name: 'Admin User', email: 'admin@example.com', role: 'admin', phone: '+1 555 000 0001', status: 'active', createdAt: '2025-01-15' },
  { id: 'U002', name: 'Jane Doe', email: 'jane@example.com', role: 'admin', phone: '+1 555 000 0002', status: 'active', createdAt: '2025-02-01' },
  { id: 'U003', name: 'John Smith', email: 'john@example.com', role: 'admin', phone: '+1 555 000 0003', status: 'inactive', createdAt: '2024-11-05' },
]
