export { LoginPage } from './pages/login-page'
export { ProtectedRoute } from './components/protected-route'
export { GuestRoute } from './components/guest-route'
export { RoleGuard } from './components/role-guard'
export { useAuthStore, useAuth, getDefaultRoute, initAuth } from './store/auth-store'
// Re-export for convenience — useTheme is theme-side but commonly used alongside auth.
export { useTheme } from '@/shared/stores/theme-store'
