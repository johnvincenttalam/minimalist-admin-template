export type NotificationType = 'info' | 'warning' | 'success' | 'danger'

export interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  read: boolean
  createdAt: Date
}
