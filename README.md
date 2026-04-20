# Admin Template

A reusable, feature-first React admin template. Drop in new features, strip out unused ones, and re-theme without touching component code.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — theme tokens via CSS variables
- **React Router v7** — with lazy routes per feature
- **TanStack Query** + **TanStack Table** — data + table primitives
- **Zustand** — auth, theme, UI state
- **React Hook Form** + **Zod** — forms + validation
- **Framer Motion** — transitions
- **Recharts** — charts (lazy-loaded, only fetched when `/admin/charts` is visited)
- **Sonner** — toasts

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — all vars have defaults
npm run dev
```

Open http://localhost:5173 and sign in with `admin@example.com` / `demo123`.

## Architecture

```
src/
├── app/                    # Composition root
│   ├── App.tsx             # Error boundary wrapper
│   ├── providers.tsx       # QueryClient + Router + Toaster
│   └── routes.tsx          # Lazy routes, filtered by feature flags
├── config/                 # ★ Single source of truth
│   ├── app.ts              # Name, logo, login copy
│   ├── navigation.ts       # Sidebar menu
│   ├── features.ts         # Feature flags
│   ├── locale.ts           # Currency, locale defaults
│   └── theme.ts             # Accent presets
├── features/               # ★ Self-contained feature folders (drop-in reuse)
│   ├── auth/               #   adapters/, components/, pages/, store/
│   ├── users/              #   api/, data/, hooks/, pages/, types.ts
│   ├── orders/             #   Master-detail table example
│   ├── forms/, charts/, profile/, roles/, activity/, dashboard/,
│   ├── settings/, ui-kit/
│   └── <each has index.ts barrel>
├── shared/
│   ├── ui/                 # Reusable primitives (Button, Card, Toggle, …)
│   ├── layout/             # AdminLayout, Sidebar, Topbar, NotificationCenter
│   ├── hooks/              # useClickOutside
│   ├── lib/                # http — typed fetch wrapper with auth injection
│   ├── stores/             # themeStore
│   ├── utils/              # cn, format, export-csv
│   ├── pages/              # 404
│   └── env.ts              # Typed env accessor
├── main.tsx
└── index.css               # Tailwind theme + accent presets
```

The feature-first layout means copying a single folder (e.g. `features/orders`) into another project brings the pages, data, types, and barrel exports with it.

## Customization

### Branding

Edit `src/config/app.ts` to change the app name, logo icon (any Lucide icon), login tagline, and demo credentials. Or override the name via `.env.local`:

```env
VITE_APP_NAME="My Admin"
```

### Navigation & feature flags

`src/config/features.ts` controls which features are active:

```ts
export const features = {
  dashboard: true,
  charts: false,   // ← turn a feature off
  table: true,
  // ...
}
```

Disabled features are filtered from **both** the sidebar and the route table. Their lazy chunk never loads.

`src/config/navigation.ts` drives the sidebar menu. Each item references a `feature` key; change the order, labels, or icons in one file.

### Theming

Four accent presets (`zinc`, `indigo`, `emerald`, `rose`) are defined as CSS variables in `src/index.css`. The active preset is applied as a class on `<html>` and persisted in localStorage.

- Users can switch presets live under **Settings → Appearance**.
- Set the default for new visitors with `VITE_DEFAULT_ACCENT` in `.env.local`.
- Light/dark mode has a separate class, and each accent has distinct light/dark values so all combinations stay readable.

Tailwind exposes three utilities from the accent: `bg-accent`, `bg-accent-hover`, `text-accent-fg`. Use them in any component that should follow the theme.

### Locale & formatting

`src/config/locale.ts` defaults the `formatCurrency`, `formatNumber` helpers in `shared/utils/format.ts`:

```env
VITE_DEFAULT_CURRENCY="EUR"
VITE_DEFAULT_LOCALE="de-DE"
```

### Auth

The `AuthAdapter` interface (`features/auth/adapters/auth-adapter.ts`) abstracts login/logout/session-restore. The default `mockAuthAdapter` matches any email in `mockUsers` with any password.

To wire up a real backend, implement `AuthAdapter` with your provider (Supabase, Clerk, Auth0, custom JWT) and change the single export in `features/auth/adapters/index.ts` — nothing else in the app needs to change. `ProtectedRoute`, the store, and the HTTP client will all pick up the new implementation.

### HTTP

`src/shared/lib/http.ts` is a typed `fetch` wrapper:

- Prepends `VITE_API_URL` to paths
- Injects `Authorization: Bearer <token>` from `authAdapter.getToken()`
- Serializes JSON bodies
- Normalizes errors into an `HttpError` with status, status text, and parsed body

```ts
import { http } from '@/shared/lib/http'
const users = await http.get<User[]>('/users')
const created = await http.post<User>('/users', { name, email })
```

See `features/users/api/users-api.ts` for the pattern — the mock implementation there shows how to swap in real calls.

## Adding a new feature

1. Create `features/<name>/` with `pages/`, `index.ts`, and any feature-specific `api/`, `data/`, `hooks/`, `types.ts`, `components/`.
2. Re-export the page from the feature's `index.ts`.
3. Register a lazy import and route in `src/app/routes.tsx`.
4. Add a nav entry in `src/config/navigation.ts`.
5. Add the feature's key to `src/config/features.ts`.

That's it — no cross-feature edits, no wiring in a global store.

## Environment variables

All variables are prefixed with `VITE_` and have sensible defaults. See `.env.example` for the full list:

| Variable | Purpose |
|-|-|
| `VITE_APP_NAME` | App name shown in sidebar / login / document title |
| `VITE_API_URL` | Base URL for the HTTP client |
| `VITE_DEFAULT_ACCENT` | `zinc` / `indigo` / `emerald` / `rose` |
| `VITE_DEFAULT_CURRENCY` | ISO 4217 code, e.g. `USD`, `EUR`, `PHP` |
| `VITE_DEFAULT_LOCALE` | BCP 47 tag, e.g. `en-US`, `de-DE` |

## Error handling

- **Route-level** — each lazy route is wrapped in an `<ErrorBoundary>`, so a render error shows a recoverable error card instead of blanking the app.
- **HTTP** — `http.*` throws `HttpError` on non-2xx responses. TanStack Query surfaces it via `query.error`.

## Scripts

```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Type-check + production build (outputs to dist/)
npm run preview  # Preview the production build
npm run lint     # ESLint
```

## Demo account

```
Email:    admin@example.com
Password: demo123
```

## License

Use it freely for any project.
