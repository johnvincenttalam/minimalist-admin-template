import { addDays } from 'date-fns'
import type { KanbanTask, ColumnConfig } from '../types'

const today = new Date()

export const columns: ColumnConfig[] = [
  { id: 'backlog',     label: 'Backlog',     color: 'bg-zinc-400' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'review',      label: 'Review',      color: 'bg-amber-500' },
  { id: 'done',        label: 'Done',        color: 'bg-emerald-500' },
]

export const mockTasks: KanbanTask[] = [
  { id: '1',  title: 'Set up CI/CD pipeline',       description: 'Configure GitHub Actions for automated testing and deployment', column: 'backlog',     priority: 'high',   assignee: 'Alex Chen',       dueDate: addDays(today, 7) },
  { id: '2',  title: 'Design system tokens',         description: 'Define color, spacing, and typography tokens',                column: 'backlog',     priority: 'medium', assignee: 'Sarah Miller' },
  { id: '3',  title: 'Write API documentation',      description: 'Document all REST endpoints with examples',                   column: 'backlog',     priority: 'low',    dueDate: addDays(today, 14) },
  { id: '4',  title: 'Implement search feature',     description: 'Full-text search across orders and users',                    column: 'in-progress', priority: 'high',   assignee: 'Alex Chen',       dueDate: addDays(today, 3) },
  { id: '5',  title: 'Add dark mode toggle',         description: 'Wire theme store to a settings toggle',                       column: 'in-progress', priority: 'medium', assignee: 'Jordan Lee' },
  { id: '6',  title: 'Fix pagination bug',           description: 'Table shows wrong count on last page',                        column: 'in-progress', priority: 'urgent', assignee: 'Sarah Miller',    dueDate: addDays(today, 1) },
  { id: '7',  title: 'Refactor auth adapter',        description: 'Clean up mock adapter, add JSDoc comments',                   column: 'review',      priority: 'low',    assignee: 'Alex Chen' },
  { id: '8',  title: 'Dashboard chart update',       description: 'Switch bar chart to use new dataset',                         column: 'review',      priority: 'medium', assignee: 'Jordan Lee',      dueDate: addDays(today, 2) },
  { id: '9',  title: 'E2E test for login flow',      description: 'Cover happy path and error states',                           column: 'review',      priority: 'high',   assignee: 'Sarah Miller' },
  { id: '10', title: 'Update dependency versions',   description: 'Bump React, Vite, and Tailwind',                              column: 'done',        priority: 'medium', assignee: 'Alex Chen' },
  { id: '11', title: 'Add notification center',      description: 'Bell icon dropdown with recent notifications',                column: 'done',        priority: 'high',   assignee: 'Jordan Lee' },
  { id: '12', title: 'Fix mobile sidebar overlap',   description: 'Sidebar overlaps content on small screens',                   column: 'done',        priority: 'urgent', assignee: 'Sarah Miller' },
  { id: '13', title: 'Add breadcrumb navigation',    description: 'Contextual breadcrumbs on nested pages',                      column: 'backlog',     priority: 'low' },
  { id: '14', title: 'Optimize bundle size',         description: 'Analyze and reduce vendor chunk',                             column: 'in-progress', priority: 'medium', assignee: 'Alex Chen',       dueDate: addDays(today, 5) },
]
