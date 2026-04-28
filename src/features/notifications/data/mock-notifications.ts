import { subHours, subDays, subMinutes } from 'date-fns'
import type { Notification } from '../types'

const now = new Date()

export const mockNotifications: Notification[] = [
  { id: '1',  title: 'New user registered',          description: 'Jane Doe created an account',                       type: 'info',    read: false, createdAt: subMinutes(now, 5) },
  { id: '2',  title: 'High CPU usage detected',      description: 'Server us-east-1 exceeded 90% CPU for 10 minutes',  type: 'warning', read: false, createdAt: subMinutes(now, 15) },
  { id: '3',  title: 'Deployment succeeded',          description: 'v2.4.1 deployed to production',                     type: 'success', read: false, createdAt: subMinutes(now, 42) },
  { id: '4',  title: 'Payment failed',                description: 'Invoice #1042 payment was declined',                type: 'danger',  read: false, createdAt: subHours(now, 1) },
  { id: '5',  title: 'Scheduled maintenance',         description: 'System maintenance planned for this weekend',       type: 'info',    read: false, createdAt: subHours(now, 3) },
  { id: '6',  title: 'Backup completed',              description: 'Daily database backup finished successfully',       type: 'success', read: true,  createdAt: subHours(now, 5) },
  { id: '7',  title: 'SSL certificate expiring',      description: 'Certificate for api.example.com expires in 7 days', type: 'warning', read: true,  createdAt: subHours(now, 8) },
  { id: '8',  title: 'New comment on task',           description: 'Alex commented on "Update landing page"',           type: 'info',    read: true,  createdAt: subDays(now, 1) },
  { id: '9',  title: 'Role permissions updated',      description: 'Editor role now has export access',                 type: 'info',    read: true,  createdAt: subDays(now, 1) },
  { id: '10', title: 'Disk space warning',            description: 'Storage volume at 85% capacity',                    type: 'warning', read: true,  createdAt: subDays(now, 1) },
  { id: '11', title: 'Order #2048 shipped',           description: 'Tracking number generated and sent to customer',    type: 'success', read: true,  createdAt: subDays(now, 1) },
  { id: '12', title: 'Failed login attempt',          description: '3 failed attempts from IP 192.168.1.100',           type: 'danger',  read: true,  createdAt: subDays(now, 2) },
  { id: '13', title: 'API rate limit reached',        description: '/api/search endpoint hit 1000 req/min limit',       type: 'warning', read: true,  createdAt: subDays(now, 2) },
  { id: '14', title: 'Team member invited',           description: 'Sarah Miller was invited to the workspace',         type: 'info',    read: true,  createdAt: subDays(now, 3) },
  { id: '15', title: 'Database migration completed',  description: 'Migration #47 applied to production',               type: 'success', read: true,  createdAt: subDays(now, 4) },
  { id: '16', title: 'Service outage resolved',       description: 'Payment gateway restored after 12 min downtime',    type: 'danger',  read: true,  createdAt: subDays(now, 5) },
  { id: '17', title: 'Weekly report generated',       description: 'Analytics report for week 16 is ready',             type: 'info',    read: true,  createdAt: subDays(now, 6) },
  { id: '18', title: 'New feature flag created',      description: '"dark-mode-v2" flag added to staging',              type: 'info',    read: true,  createdAt: subDays(now, 7) },
]
