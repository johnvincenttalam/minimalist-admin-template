import type { FeatureKey } from './features'

/**
 * One module import per feature, shared between:
 *  - `app/routes.tsx` — wraps each in `React.lazy` for route-level code splitting
 *  - `shared/layout/sidebar.tsx` — warms the chunk cache on link hover
 *
 * Dynamic `import()` is idempotent — calling it more than once returns the
 * same cached promise, so hovering then clicking doesn't re-download.
 */
export const featureImports: Record<FeatureKey, () => Promise<unknown>> = {
  dashboard: () => import('@/features/dashboard'),
  charts:    () => import('@/features/charts'),
  table:     () => import('@/features/orders'),
  forms:     () => import('@/features/forms'),
  users:     () => import('@/features/users'),
  roles:     () => import('@/features/roles'),
  activity:  () => import('@/features/activity'),
  profile:   () => import('@/features/profile'),
  uiKit:     () => import('@/features/ui-kit'),
  settings:  () => import('@/features/settings'),
}

export function prefetchFeature(key: FeatureKey) {
  featureImports[key]().catch(() => {
    // Network / chunk load errors will surface on the real navigation;
    // prefetch is a best-effort warm-up and should never throw.
  })
}
