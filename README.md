# Admin Template

A reusable, feature-first React admin template. Drop in new features, strip out unused ones, swap auth/HTTP/storage providers, and re-theme without touching component code.

```
React 19  ·  TypeScript  ·  Vite  ·  Tailwind v4  ·  Zustand  ·  React Query
```

---

## Why this template

- **Feature-first folders** — copy `features/<name>/` into another project and the pages, data, types, and routes come with it.
- **Adapter pattern at every swap point** — auth, HTTP, storage are interfaces with default mock/local implementations. One file changes when you go to production.
- **Config layer in one place** — branding, navigation, feature flags, locale, theme are five config files. No hardcoded names, hardcoded routes, or hardcoded currencies.
- **Accent-token theming** — four presets ship; live-switchable in Settings. Every interactive primitive (Checkbox, Tabs, Toggle, FilterChips, ...) tracks the active accent automatically.
- **Dark mode that actually works** — class-targeted dark CSS for every shipped component, including the alpha-modifier and Recharts edge cases (see `docs/dark-mode-patterns.md`).
- **Lazy routes + sidebar prefetch** — the first paint is small; chunks warm up on hover.
- **Accessible by lint** — `eslint-plugin-jsx-a11y` enforces label/control association, keyboard support on clickables, and stays out of the way for legitimate cases.
- **67 tests, coverage tooling, and a real audit trail** — `http.ts` is 97% covered; auth surface is near 100%.

---

## Quick start

```bash
git clone <your-fork-url>
cd minimalist-admin-template
npm install
cp .env.example .env.local      # optional — all vars have defaults
npm run dev
```

Open http://localhost:5173 and sign in:

```
Email:     admin@example.com
Password:  demo123
```

---

## Stack

| Concern | Choice | Why |
|-|-|-|
| Framework | **React 19** + **Vite 8** | Fast HMR, tiny dev server boot |
| Language | **TypeScript 5.9** strict + `erasableSyntaxOnly` | Forces explicit types; rejects parameter properties |
| Styling | **Tailwind CSS v4** | `@theme` block + CSS variables for accents |
| Routing | **React Router 7** | Lazy routes per feature |
| Data | **TanStack Query 5** | Caching, refetch, mutations |
| Tables | **TanStack Table 8** | Headless table primitives (sort, filter, paginate) |
| State | **Zustand 5** | Selector-based subscriptions, no boilerplate |
| Forms | **React Hook Form 7** + **Zod 4** | Schema-validated forms |
| Maps | **Leaflet** + **react-leaflet** | Free OSM tiles, no API key |
| Charts | **Recharts** | Composable SVG charts |
| Animation | **Framer Motion** | Page enters, list items, modals |
| Toasts | **Sonner** | Promise-aware notifications |
| Tests | **Vitest** + **@testing-library/react** + **@vitest/coverage-v8** | jsdom env |
| Lint | **ESLint** + **typescript-eslint** + **eslint-plugin-jsx-a11y** | Accessibility baseline |

---

## Architecture

```
src/
├── app/                    # Composition root
│   ├── App.tsx             # Top-level error boundary
│   ├── providers.tsx       # QueryClient + Router + Toaster + AuthBootstrap + HttpAuthBridge
│   └── routes.tsx          # Lazy routes filtered by feature flags
│
├── config/                 # ★ Single source of truth for customization
│   ├── app.ts              # Name, logo, login copy, demo credentials
│   ├── features.ts         # Feature flags (drives sidebar + routes)
│   ├── feature-imports.ts  # Lazy-import map (shared by routes + sidebar prefetch)
│   ├── navigation.ts       # Sidebar menu (label, path, icon, feature)
│   ├── locale.ts           # Currency, locale defaults
│   └── theme.ts            # Accent presets + swatches
│
├── features/               # ★ Self-contained feature folders
│   ├── auth/               #   adapters/, components/, pages/, store/
│   ├── dashboard/, charts/, forms/, kanban/
│   ├── users/, roles/, profile/, settings/
│   ├── orders/             #   route /admin/table — advanced table + detail
│   ├── activity/, notifications/, calendar/, map/, ui-kit/
│   └── <each has index.ts barrel>
│
├── shared/
│   ├── ui/                 # Reusable primitives (29 files)
│   ├── layout/             # AdminLayout, Sidebar, Topbar, NotificationCenter
│   ├── hooks/              # useClickOutside, useLocalStorageState
│   ├── lib/                # http (typed fetch), storage (namespaced KV)
│   ├── stores/             # theme-store + useTheme façade
│   ├── utils/              # cn, format, export-csv
│   ├── pages/              # 404
│   └── env.ts              # Typed env accessor
│
├── test/setup.ts           # Vitest globals + cleanup + localStorage reset
├── main.tsx
└── index.css               # Tailwind theme + accent presets + dark-mode CSS
```

**Path alias:** `@/*` → `./src/*`. Use it everywhere — never relative imports that climb out of a feature.

---

## Features inventory

Every feature is gated on a flag in `src/config/features.ts`. Set any to `false` and both the sidebar entry and the route disappear; the lazy chunk never loads.

| Feature | Route | Flag | What it demonstrates |
|-|-|-|-|
| **Dashboard** | `/admin` | `dashboard` | Stat cards, page header, layout |
| **Charts** | `/admin/charts` | `charts` | Recharts area / bar / line / pie variants with dark-mode SVG fixes |
| **Table** | `/admin/table` | `table` | TanStack Table with sort, filter, row-selection, bulk actions, column toggle, full pagination, CSV export |
| **Order detail** | `/admin/table/:id` | `table` | Master-detail pattern, tabs, timeline, related list |
| **Forms** | `/admin/forms` | `forms` | Wizard (multi-step), conditional fields, file upload, Zod validation |
| **Users** | `/admin/users` | `users` | TanStack Table + simple pagination, modal form, status badges, row actions |
| **Roles** | `/admin/roles` | `roles` | Role + permission selection UI |
| **Activity** | `/admin/activity` | `activity` | Activity feed with filtering |
| **Notifications** | `/admin/notifications` | `notifications` | Notification list + dropdown, type-tinted icons, mark-read / delete |
| **Calendar** | `/admin/calendar` | `calendar` | Month / week / day views, event create/edit modal |
| **Kanban** | `/admin/kanban` | `kanban` | Drag-and-drop board with 4 columns |
| **Map** | `/admin/map` | `map` | Leaflet POIs, click-to-add, persisted across refresh |
| **Profile** | `/admin/profile` | `profile` | Tabbed account settings — profile / password / 2FA / sessions |
| **UI Kit** | `/admin/ui-kit` | `uiKit` | Visual catalog of every shared/ui primitive |
| **Settings** | `/admin/settings` | `settings` | App settings — general, appearance (theme + accent), notifications, security, system |
| **Auth (Login)** | `/login` | always | Form + Zod validation + demo autofill, wrapped in `<GuestRoute>` |

To add or remove: see [Recipes → Add a feature](#add-a-feature) / [Remove a feature](#remove-a-feature).

---

## UI components catalog

All in `src/shared/ui/` and re-exported from `src/shared/ui/index.ts`. Import as `import { Button } from '@/shared/ui'` or directly `from '@/shared/ui/button'`.

### Primitives

| Component | Props of note | Use for |
|-|-|-|
| `<Button>` | `variant: primary \| secondary \| danger \| success \| ghost \| outline`, `size`, `loading`, `leftIcon`, `rightIcon`, `fullWidth` | All actions; primary uses `bg-accent` |
| `<Input>` | `label`, `error`, `helperText`, `leftIcon` | Text inputs with built-in label/error |
| `<Textarea>` | `label`, `error`, `rows` | Multi-line input |
| `<Select>` | `options: {label,value}[]`, `placeholder`, `label`, `error` | Native select with custom chevron |
| `<Checkbox>` | `checked`, `indeterminate`, `onChange`, `size: sm \| md` | Accent-themed; auto dark-mode |
| `<Toggle>` | `checked`, `onChange`, `size: sm \| md` | Switch; track uses `bg-accent` when on |
| `<SearchInput>` | `value`, `onChange`, `placeholder` | Magnifier-prefixed search input |
| `<FilterChips>` | `value`, `onChange`, `options: {label,value,count?}[]`, `size: sm \| md` | Segmented control; active uses accent |
| `<Tabs>` | `items: {label,value,count?}[]`, `value`, `onChange` | Underlined tabs; active uses accent |
| `<Badge>` | `variant: default \| success \| warning \| danger \| info \| outline`, `size` | Status pill |
| `<StatusBadge>` | `status: string` | Auto-maps `pending`/`paid`/`shipped`/etc. to colors + dot |
| `<Avatar>` | `name`, `size: sm \| md \| lg`, `tone: auto \| accent` | Auto-colored initials by name hash, or accent-themed |
| `<Spinner>` | `size: sm \| md \| lg` | Loading indicator |
| `<Breadcrumb>` | (auto from route) | Top-of-page breadcrumb |
| `<Card>` + `<CardHeader>` + `<CardTitle>` + `<CardDescription>` + `<CardContent>` + `<CardFooter>` | Standard slots | Container surface |

### Composition / utility components

| Component | Props of note | Use for |
|-|-|-|
| `<IconTile>` | `icon: LucideIcon`, `size: sm \| md \| lg`, `tone: zinc \| blue \| emerald \| amber \| red \| violet \| indigo \| orange \| cyan \| purple` | Tinted-icon-square (notification icons, empty states, file rows) |
| `<MenuItem>` | `icon?: LucideIcon`, `leading?: ReactNode`, `tone: default \| danger`, `density: default \| compact`, `onClick` | Dropdown menu rows |
| `<MenuDivider>` | — | Separator between menu sections |
| `<Popover>` | `trigger: ({open,toggle}) => ReactNode`, `children: ReactNode \| ({close}) => ReactNode`, `align: left \| right`, `width` | Click-outside-aware floating panel; wraps `useClickOutside` |
| `<SelectMenu>` | `value`, `onChange`, `options`, `placeholder`, `icon?` | Single-select dropdown built on Popover + MenuItem (visual parity with `<Button>`) |
| `<TablePagination>` | `table: Table<T>`, `mode: simple \| full`, `pageSizes` | TanStack-aware pagination row |
| `<RowActions>` | `onView`, `onEdit`, `onDelete` | Three-dot menu on table rows; portal-positioned |
| `<Modal>` | `open`, `onClose`, `title?`, `size: sm \| md \| lg \| xl`, `footer?` | Dialog with focus trap + ESC + scroll lock |
| `<EmptyState>` | `icon?: LucideIcon`, `title`, `description?`, `action?` | "No results" / "no data" surface |
| `<PageHeader>` | `title`, `subtitle?`, `actions?` | Standard top-of-page header |
| `<StatCard>` | `label`, `value`, `change?`, `icon`, `tone` | KPI tile |
| `<TableSkeleton>` + `<StatCardSkeleton>` | `columns`, `rows` | Shimmer loaders |
| `<ErrorBoundary>` | `fallback?`, `onError?` | Wrap risky subtrees; default fallback is a recoverable error card |

### Layout components (`src/shared/layout/`)

| Component | What it does |
|-|-|
| `<AdminLayout>` | Sidebar + topbar + content area. Sidebar collapsed state persists via `useLocalStorageState`. |
| `<Sidebar>` | Reads `config/navigation.ts`, filters by feature flags, prefetches lazy chunks on hover. |
| `<Topbar>` | Search, theme toggle, `<NotificationCenter>`, profile dropdown (uses `<Popover>` + `<MenuItem>`). |
| `<NotificationCenter>` | Bell with unread count, popover with type-tinted icons, "Mark all read" + "View all" link. |

---

## Configuration layer

These five files in `src/config/` are the customization surface. Touch these first; never hardcode their concerns elsewhere.

### `app.ts` — branding

```ts
export const appConfig: AppConfig = {
  name: env.appName,             // VITE_APP_NAME, default "Admin"
  shortName: env.appName,
  logo: Shield,                  // any LucideIcon
  login: { heading, tagline, features: [] },
  demo: { email, password },     // shown on the login page
}
```

### `features.ts` — feature flags

```ts
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
```

Set any to `false` — sidebar and route both disappear.

### `feature-imports.ts` — lazy import map

```ts
export const featureImports: Record<FeatureKey, () => Promise<unknown>> = {
  dashboard: () => import('@/features/dashboard'),
  // ...
}
```

Used by `routes.tsx` (route-level code splitting) and `sidebar.tsx` (hover prefetch). One source of truth.

### `navigation.ts` — sidebar menu

```ts
export const navigation: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, feature: 'dashboard' },
  // ...
]
```

`feature` ties each item to a flag; `divider: true` adds a separator above.

### `locale.ts` + `theme.ts`

`locale.ts` sets currency / locale defaults consumed by `formatCurrency` and `formatNumber` in `shared/utils/format.ts`. `theme.ts` lists accent presets and their UI swatches.

---

## Theming & dark mode

### Accent system

Four presets live in `src/index.css` as CSS classes on `<html>`:

```css
.accent-zinc    { --accent-500: #18181b; --accent-600: #27272a; --accent-fg: #ffffff; }
.accent-indigo  { --accent-500: #6366f1; --accent-600: #4f46e5; --accent-fg: #ffffff; }
.accent-emerald { --accent-500: #10b981; --accent-600: #059669; --accent-fg: #ffffff; }
.accent-rose    { --accent-500: #f43f5e; --accent-600: #e11d48; --accent-fg: #ffffff; }

/* Each has a dark-mode override: */
.dark.accent-zinc { --accent-500: #fafafa; --accent-600: #e4e4e7; --accent-fg: #09090b; }
```

Tailwind utilities surfaced from these:

| Class | Maps to |
|-|-|
| `bg-accent` | `var(--accent-500)` |
| `bg-accent-hover` | `var(--accent-600)` |
| `text-accent-fg` | `var(--accent-fg)` |
| `text-accent` | `var(--accent-500)` (as text color) |
| `border-accent` | `var(--accent-500)` (as border color) |

**Use these everywhere a primary action lives.** The audit caught and fixed 7 components that were hardcoding `bg-zinc-900` instead — Checkbox, Toggle, Tabs, FilterChips, NotFound CTA, ConditionalForm, UploadForm progress bar.

### Dark mode

Class-targeted: a `.dark` class on `<html>` triggers overrides in `src/index.css`. Light mode is the default. Toggle persists to `localStorage`.

**Read this before adding new tinted classes:** [`docs/dark-mode-patterns.md`](./docs/dark-mode-patterns.md). It documents 8 categories of dark-mode bugs the template has already fixed (alpha modifiers, `divide-*` utilities, Recharts inline SVG attributes, `surface-paper` for ink-on-paper canvases, etc.).

---

## Auth & guards

### Adapter

`features/auth/adapters/auth-adapter.ts` defines:

```ts
interface AuthAdapter {
  login(email, password): Promise<User | null>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>   // restore on app boot
  getToken(): string | null                // injected into Authorization header
}
```

Two implementations ship:

| Adapter | What it does |
|-|-|
| `mockAuthAdapter` (default) | Matches any email in `mockUsers` with any password. Stores user id in localStorage. Intended for local dev and public demos — swap to `httpAuthAdapter` before shipping a real app. |
| `httpAuthAdapter` | POSTs to `/auth/login`, `/auth/logout`, `GET /auth/me`. Stores JWT in namespaced localStorage. |

Swap by uncommenting one line in `features/auth/adapters/index.ts`:

```ts
// import { httpAuthAdapter } from './http-auth-adapter'
export const authAdapter: AuthAdapter = mockAuthAdapter   // ← change this
```

### Hooks

```ts
import { useAuth, useAuthStore } from '@/features/auth'

const { user, isAuthenticated, loading, login, logout } = useAuth()  // selector-based, no whole-store re-renders
useAuthStore.getState().user                                          // for non-React contexts
```

### Guards

| Component | Use for |
|-|-|
| `<ProtectedRoute>` | Wraps protected route trees. Optional `allowedRoles`. Redirects to `/login`. |
| `<GuestRoute>` | Inverse — wraps `/login`, `/signup` etc. Redirects authed users to their default route. |
| `<RoleGuard>` | In-page role gating with optional `fallback`. Use for buttons / sections. |

### 401 handling

`http.ts` calls a registered handler on 401, which `<HttpAuthBridge>` (in `providers.tsx`) wires to `useNavigate('/login')` — a soft client-side redirect, not a hard reload. Set `skipAuth: true` on the request to opt out (the login endpoint does this).

---

## State & data flow

### Zustand stores

| Store | Façade | Slices |
|-|-|-|
| `useAuthStore` | `useAuth()` | `user`, `isAuthenticated`, `isRestoring` (alias `loading`), `login`, `logout`, `restore` |
| `useThemeStore` | `useTheme()` | `theme`, `accent`, `toggle`, `setTheme`, `setAccent` |

**Always use the façade hooks** — they read each slice with a selector so consumers only re-render on the slices they touch. Destructuring `useAuthStore()` directly subscribes to every field.

### Data fetching

`@tanstack/react-query` is set up in `providers.tsx` with sensible defaults (`staleTime: 5min`, no refetch on focus). Each feature owns its query hooks under `features/<name>/hooks/` and its API under `features/<name>/api/`. Mock implementations exist; the commented HTTP version in each `*-api.ts` file shows the swap.

```ts
// features/users/api/users-api.ts
export const usersApi = {
  list: () => Promise.resolve(mockUsers),
  // list: () => http.get<User[]>('/users'),    ← uncomment when backend ready
}
```

---

## Persistence

`src/shared/lib/storage.ts` provides a namespaced storage adapter:

```ts
import { storage } from '@/shared/lib/storage'

storage.set('preferences', { sidebar: 'collapsed' })
const prefs = storage.get('preferences', {})
storage.remove('preferences')
```

All keys auto-prefixed with `env.appName.toLowerCase()` (default `admin:`). All methods are sync, swallow exceptions (private mode, quota), and SSR-safe.

For React state that should survive refresh, use `useLocalStorageState`:

```ts
import { useLocalStorageState } from '@/shared/hooks/use-local-storage-state'

const [collapsed, setCollapsed] = useLocalStorageState('sidebar-collapsed', false)
```

Already in use for: theme, accent, mock auth user-id, http auth token, sidebar collapsed state, map places.

To swap to IndexedDB / remote KV: write a new `StorageAdapter` implementation, change the `storage` export. Every consumer picks it up.

---

## HTTP client

`src/shared/lib/http.ts` — typed `fetch` wrapper:

```ts
import { http, HttpError } from '@/shared/lib/http'

const users = await http.get<User[]>('/users')
const created = await http.post<User>('/users', { name, email })
const filtered = await http.get<User[]>('/users', { params: { q: 'alice', page: 2 } })

await http.post('/auth/login', creds, { skipAuth: true })  // skip Bearer header
```

| Behavior | Implementation |
|-|-|
| Base URL | `env.apiUrl` (`VITE_API_URL`) |
| Auth | `Authorization: Bearer ${authAdapter.getToken()}` unless `skipAuth: true` |
| Body | JSON.stringify; sets `Content-Type: application/json` |
| Errors | Throws `HttpError(status, statusText, message, body)` on non-2xx |
| 401 | Calls `authAdapter.logout()` + invokes the registered unauthorized handler (router-aware) |
| Query params | `params: { q, page }` → URL search; `null`/`undefined` skipped |

Test coverage on `http.ts`: **97% lines, 90% branches**.

---

## Routing

`src/app/routes.tsx` — every `/admin/*` page is `React.lazy()`'d via `featureImports`. Each lazy route is wrapped in `<ErrorBoundary>` so a render error in one page doesn't blank the app. The sidebar warms each chunk on hover via `prefetchFeature(item.feature)`.

```tsx
<Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

<Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
  {features.dashboard && <Route index element={<Lazy><AdminDashboard /></Lazy>} />}
  {/* ... */}
</Route>
```

---

## Testing

```bash
npm test              # one-shot
npm run test:watch    # watch mode
npm run test:ui       # vitest UI
npm run test:coverage # coverage report (HTML + text)
```

| What's tested | Coverage |
|-|-|
| `http.ts` (URL building, params, headers, 401 handler, errors, 204) | 97% lines |
| Auth store (login / logout / restore / failure) | 100% |
| `useAuth` hook | 100% |
| `<ProtectedRoute>`, `<GuestRoute>`, `<RoleGuard>` (loading + redirects + role checks) | 100% |
| `<LoginPage>` (form, success nav, bad creds, validation, demo button) | high |
| `httpAuthAdapter` (login / logout / getCurrentUser / token persistence / network failure) | 100% |
| Sample feature pages — dashboard, kanban, calendar, notifications, map | smoke |

Co-locate tests with source: `foo.tsx` ↔ `foo.test.tsx`. Vitest globals are enabled. `localStorage` is cleared between tests in `src/test/setup.ts`.

---

## Recipes

### Add a feature

1. Create `src/features/<name>/` with at least `pages/<name>-page.tsx` + `index.ts`:
   ```ts
   export { NamePage } from './pages/<name>-page'
   ```

2. Register the lazy import in `src/config/feature-imports.ts`:
   ```ts
   <name>: () => import('@/features/<name>'),
   ```

3. Add a route in `src/app/routes.tsx`:
   ```tsx
   const NamePage = lazy(() => featureImports.<name>().then((m: any) => ({ default: m.NamePage })))
   ...
   {features.<name> && <Route path="<name>" element={<Lazy><NamePage /></Lazy>} />}
   ```

4. Add a nav entry in `src/config/navigation.ts`:
   ```ts
   { label: 'Name', path: '/admin/<name>', icon: SomeIcon, feature: '<name>' },
   ```

5. Add the key to `src/config/features.ts`:
   ```ts
   <name>: true,
   ```

6. Add at least one test in `src/features/<name>/`.

### Remove a feature

1. Delete `src/features/<name>/`.
2. Remove its line from `src/config/feature-imports.ts`.
3. Remove its line from `src/config/navigation.ts`.
4. Remove its key from `src/config/features.ts`.
5. Remove its `lazy()` declaration + `<Route>` from `src/app/routes.tsx`.

### Wire a real backend (auth)

1. Update endpoints in `src/features/auth/adapters/http-auth-adapter.ts` if your routes differ from `/auth/login`, `/auth/logout`, `/auth/me`.
2. Uncomment the import + change the export in `src/features/auth/adapters/index.ts`:
   ```ts
   import { httpAuthAdapter } from './http-auth-adapter'
   export const authAdapter: AuthAdapter = httpAuthAdapter
   ```
3. Set `VITE_API_URL` in `.env.local` to your API origin.
4. The mock-auth production guard now passes; everything else (`http.ts`, `<ProtectedRoute>`, `useAuth`, the topbar, the login page) picks up the new adapter automatically.

### Wire a real backend (data)

For each feature, swap the mock body in `features/<name>/api/<name>-api.ts` for the commented HTTP version:

```ts
export const usersApi = {
  list: () => http.get<User[]>('/users'),
  create: (body) => http.post<User>('/users', body),
  // ...
}
```

React Query hooks (`useUsers`, etc.) keep working — their backing function changed, not their signature.

### Add a new accent preset

1. Add the key to `src/config/theme.ts`:
   ```ts
   export const ACCENTS = ['zinc', 'indigo', 'emerald', 'rose', 'amber'] as const
   export const accentSwatches = { ..., amber: { label: 'Amber', swatch: '#f59e0b' } }
   ```

2. Add the CSS in `src/index.css` under `@layer base`:
   ```css
   .accent-amber       { --accent-500: #f59e0b; --accent-600: #d97706; --accent-fg: #ffffff; }
   .dark.accent-amber  { --accent-500: #fbbf24; --accent-600: #f59e0b; --accent-fg: #1c1917; }
   ```

That's it — Settings → Appearance picks it up automatically.

### Customize branding

Edit `src/config/app.ts` — name, logo (any Lucide icon), login copy, demo creds. Or override via `.env.local`:

```env
VITE_APP_NAME="My Admin"
```

---

## Environment variables

All `VITE_`-prefixed and have defaults. See `.env.example`.

| Variable | Purpose | Default |
|-|-|-|
| `VITE_APP_NAME` | App name + storage key namespace prefix | `"Admin"` |
| `VITE_API_URL` | Base URL prepended to `http.*` paths | `""` (relative) |
| `VITE_DEFAULT_ACCENT` | Initial accent for new visitors — `zinc \| indigo \| emerald \| rose` | `zinc` |
| `VITE_DEFAULT_CURRENCY` | ISO 4217 — used by `formatCurrency` | `USD` |
| `VITE_DEFAULT_LOCALE` | BCP 47 — used by formatters | `en-US` |

---

## Scripts

```bash
npm run dev           # Dev server (http://localhost:5173)
npm run build         # tsc -b && vite build → dist/
npm run preview       # Preview the production build
npm run lint          # ESLint with jsx-a11y
npm test              # Vitest one-shot
npm run test:watch    # Vitest watch mode
npm run test:ui       # Vitest UI
npm run test:coverage # Coverage report (HTML in coverage/)
```

---

## Conventions

### Do

1. Use the path alias `@/*` — never relative imports that climb out of a feature.
2. Use `bg-accent` / `text-accent-fg` for primary actions — they track the active preset.
3. Use `useAuth()` / `useTheme()` façades — selector-based, no whole-store re-renders.
4. Use `<IconTile>` / `<MenuItem>` / `<Popover>` / `<TablePagination>` / `<SelectMenu>` — these consolidate 8+ duplicated patterns.
5. Use the `storage` adapter and `useLocalStorageState` — never raw `localStorage`.
6. Co-locate tests: `foo.tsx` ↔ `foo.test.tsx`.
7. Run `npm test && npm run build` before declaring work done.

### Don't

1. Hardcode app name, logo, currency, locale, color — use the config layer.
2. Reach into `@/features/X` from `@/features/X`'s own barrel — circular.
3. Wire `fetch()` directly in feature API files — use `http`.
4. Use `bg-zinc-900` for primary actions — use `bg-accent` so accent presets work.
5. Use `divide-y divide-*` — replace with per-child `border-t` (the `divide-*` utility uses a sibling selector that bypasses dark-mode overrides). See `docs/dark-mode-patterns.md` Bug 4.
6. Bypass the auth adapter — no `setUser`, no setting `useAuthStore.user` directly.
7. Silence type errors with `@ts-ignore`. Fix the root cause.
8. Add `// removed` comments or rename unused-`_var` cleanups when removing code — just delete it.
9. Add `dark:` Tailwind variants on tinted classes — the template uses class-targeted dark mode in `index.css`, not Tailwind's `dark:` variants, for the alpha-modifier reasons in the dark-mode doc.

---

## Known gaps (deliberate scope)

- **No i18n** — all strings are English. Add `react-i18next` or similar when needed.
- **Mock auth + mock API** — `mockAuthAdapter` accepts any password (gated to dev builds only); each feature's `*-api.ts` returns mock data. Swap to `httpAuthAdapter` + uncomment the HTTP versions when the backend is ready.
- **Per-route loading skeletons** — Suspense fallback is a generic spinner. Could be per-feature; not currently.
- **No PWA** — no service worker, no offline-first scaffolding.
- **Single-role users** — `User.role: UserRole` is a single string, not an array. Multi-role support is a sweep through type + UI.
- **No CSRF / CSP** — relevant when you wire a real backend; not in template scope.

---

## Project metrics (at last commit)

- **3,500+ lines of source** across `src/` (excluding tests)
- **67 tests** across 15 test files
- **0 lint errors**, 8 warnings (TanStack table compiler advisories — informational)
- **0 dependency vulnerabilities**
- **125 KB gz** total eager bundle (excluding lazy chunks)

---

## Related docs

- [`docs/dark-mode-patterns.md`](./docs/dark-mode-patterns.md) — Cheat sheet for every dark-mode bug class the template fixes (alpha modifiers, `divide-*`, Recharts SVG attributes, `surface-paper`)
- [`CLAUDE.md`](./CLAUDE.md) — Conventions / "do not" list for AI / human contributors

---

## License

Use it freely for any project. Attribution appreciated, not required.
