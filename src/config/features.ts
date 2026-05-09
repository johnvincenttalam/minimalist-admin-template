export const features = {
  dashboard: true,
  charts: true,
  table: true,
  forms: true,
  users: true,
  roles: true,
  activity: true,
  notifications: true,
  calendar: true,
  kanban: true,
  map: true,
  profile: true,
  uiKit: true,
  settings: true,
} as const

export type FeatureKey = keyof typeof features

export function isFeatureEnabled(key: FeatureKey): boolean {
  return features[key]
}
