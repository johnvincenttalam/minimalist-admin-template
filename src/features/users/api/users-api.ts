import type { User } from '@/features/users/types'
import { mockUsers } from '@/features/users/data/mock-users'
// import { http } from '@/shared/lib/http'

const delay = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms ?? Math.random() * 500 + 300))

/**
 * Users API — swap the implementation below with real HTTP calls when you
 * wire up a backend. Example:
 *
 *   list: () => http.get<User[]>('/users')
 *   getById: (id) => http.get<User>(`/users/${id}`)
 *   create: (data) => http.post<User>('/users', data)
 */
export const usersApi = {
  list: async (): Promise<User[]> => {
    await delay()
    return mockUsers
  },
}
