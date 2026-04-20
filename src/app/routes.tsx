import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/shared/layout/admin-layout'
import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { Spinner } from '@/shared/ui/spinner'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import { features } from '@/config/features'
import { featureImports } from '@/config/feature-imports'

// Eager — needed on first paint
import { LoginPage } from '@/features/auth'

// Lazy — all route components share featureImports with the sidebar's hover-prefetch
const AdminDashboard = lazy(() => featureImports.dashboard().then((m: any) => ({ default: m.AdminDashboard })))
const ChartsPage = lazy(() => featureImports.charts().then((m: any) => ({ default: m.ChartsPage })))
const UsersPage = lazy(() => featureImports.users().then((m: any) => ({ default: m.UsersPage })))
const RolesPage = lazy(() => featureImports.roles().then((m: any) => ({ default: m.RolesPage })))
const ActivityPage = lazy(() => featureImports.activity().then((m: any) => ({ default: m.ActivityPage })))
const ProfilePage = lazy(() => featureImports.profile().then((m: any) => ({ default: m.ProfilePage })))
const AdvancedTablePage = lazy(() => featureImports.table().then((m: any) => ({ default: m.AdvancedTablePage })))
const OrderDetailPage = lazy(() => featureImports.table().then((m: any) => ({ default: m.OrderDetailPage })))
const FormsPage = lazy(() => featureImports.forms().then((m: any) => ({ default: m.FormsPage })))
const UIKitPage = lazy(() => featureImports.uiKit().then((m: any) => ({ default: m.UIKitPage })))
const SettingsPage = lazy(() => featureImports.settings().then((m: any) => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('@/shared/pages/not-found').then((m) => ({ default: m.NotFoundPage })))

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size="lg" />
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {features.dashboard && <Route index element={<Lazy><AdminDashboard /></Lazy>} />}
        {features.charts && <Route path="charts" element={<Lazy><ChartsPage /></Lazy>} />}
        {features.table && <Route path="table" element={<Lazy><AdvancedTablePage /></Lazy>} />}
        {features.table && <Route path="table/:id" element={<Lazy><OrderDetailPage /></Lazy>} />}
        {features.forms && <Route path="forms" element={<Lazy><FormsPage /></Lazy>} />}
        {features.users && <Route path="users" element={<Lazy><UsersPage /></Lazy>} />}
        {features.roles && <Route path="roles" element={<Lazy><RolesPage /></Lazy>} />}
        {features.activity && <Route path="activity" element={<Lazy><ActivityPage /></Lazy>} />}
        {features.profile && <Route path="profile" element={<Lazy><ProfilePage /></Lazy>} />}
        {features.uiKit && <Route path="ui-kit" element={<Lazy><UIKitPage /></Lazy>} />}
        {features.settings && <Route path="settings" element={<Lazy><SettingsPage /></Lazy>} />}
      </Route>

      <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
    </Routes>
  )
}
