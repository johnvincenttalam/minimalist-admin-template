export type UserRole = 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  status: 'active' | 'inactive'
  createdAt: string
}
