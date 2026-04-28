import { addDays, subDays } from 'date-fns'
import type { CalendarEvent } from '../types'

const today = new Date()

export const mockEvents: CalendarEvent[] = [
  { id: '1',  title: 'Team standup',           type: 'meeting',  date: today,              time: '09:00', description: 'Daily sync with the engineering team' },
  { id: '2',  title: 'Sprint review',          type: 'meeting',  date: today,              time: '14:00', description: 'Demo completed work to stakeholders' },
  { id: '3',  title: 'Deploy v2.5',            type: 'deadline', date: today,              time: '17:00', description: 'Production release deadline' },
  { id: '4',  title: 'Design review',          type: 'meeting',  date: addDays(today, 1),  time: '10:00', description: 'Review new dashboard mockups' },
  { id: '5',  title: 'Renew SSL certs',        type: 'reminder', date: addDays(today, 1),  description: 'Certificates expire next week' },
  { id: '6',  title: 'Client demo',            type: 'meeting',  date: addDays(today, 2),  time: '11:00', description: 'Product demo for Acme Corp' },
  { id: '7',  title: 'Q2 planning',            type: 'event',    date: addDays(today, 3),  time: '09:00', description: 'Quarterly planning session' },
  { id: '8',  title: 'API docs deadline',      type: 'deadline', date: addDays(today, 3),  time: '18:00', description: 'Finalize API documentation' },
  { id: '9',  title: 'Team lunch',             type: 'event',    date: addDays(today, 5),  time: '12:00', description: 'Monthly team lunch at Bistro' },
  { id: '10', title: 'Security audit',         type: 'deadline', date: addDays(today, 7),  description: 'Complete security review' },
  { id: '11', title: 'Board meeting',          type: 'meeting',  date: addDays(today, 8),  time: '10:00', description: 'Monthly board meeting' },
  { id: '12', title: 'Release v3.0',           type: 'deadline', date: addDays(today, 10), time: '17:00', description: 'Major release milestone' },
  { id: '13', title: 'Conference',             type: 'event',    date: addDays(today, 14), time: '08:00', description: 'React Summit 2025' },
  { id: '14', title: 'Pay invoices',           type: 'reminder', date: subDays(today, 1),  description: 'Monthly vendor payments due' },
  { id: '15', title: '1:1 with Sarah',         type: 'meeting',  date: subDays(today, 2),  time: '15:00', description: 'Weekly one-on-one' },
  { id: '16', title: 'Sprint retrospective',   type: 'meeting',  date: subDays(today, 3),  time: '16:00', description: 'Review last sprint' },
  { id: '17', title: 'Update dependencies',    type: 'reminder', date: subDays(today, 5),  description: 'Check for outdated npm packages' },
  { id: '18', title: 'Hackathon',              type: 'event',    date: addDays(today, 20), time: '09:00', description: 'Internal hackathon day' },
]
