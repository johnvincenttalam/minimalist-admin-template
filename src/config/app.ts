import { Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { env } from '@/shared/env'

export interface AppConfig {
  name: string
  shortName: string
  logo: LucideIcon
  login: {
    heading: string
    tagline: string
    features: string[]
  }
  demo: {
    email: string
    password: string
  }
}

export const appConfig: AppConfig = {
  name: env.appName,
  shortName: env.appName,
  logo: Shield,
  login: {
    heading: 'Welcome back',
    tagline: 'A reusable admin template. Replace this copy with your product tagline.',
    features: [
      'Authentication & role guards',
      'User management',
      'Settings & preferences',
      'Reusable UI components',
    ],
  },
  demo: {
    email: 'admin@example.com',
    password: 'demo123',
  },
}
