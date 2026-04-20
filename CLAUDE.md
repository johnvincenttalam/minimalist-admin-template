# Claude context for this repo

This is a **reusable feature-first admin template** (React 19 + Vite 8 + TypeScript + Tailwind v4). It is designed to be forked into new projects with minimal friction.

Read this file before making changes — it captures conventions that aren't obvious from the code and things that have already been tried and rejected.

## Stack — non-negotiable

- React 19, Vite 8, TypeScript 5.9 (strict, `erasableSyntaxOnly` on — no parameter properties in classes)
- Tailwind CSS v4 (`@theme` block in `src/index.css` defines tokens; CSS variables drive the accent theme)
- React Router 7, TanStack Query + Table, Zustand, React Hook Form + Zod, Framer Motion, Sonner, Lucide
- Vitest + @testing-library/react for tests (jsdom, `globals: true`)

## Architecture

```
src/
├── app/            # Composition root — App.tsx, providers.tsx, routes.tsx
├── config/         # ★ Single source of truth for all customization
├── features/       # ★ Self-contained feature folders (drop-in reuse)
├── shared/         # Reusable UI + infra (ui, layout, hooks, lib, stores, utils, env.ts)
└── main.tsx
```

Path alias: `@/*` → `./src/*`. Always use it — never relative imports that climb out of a feature (`../../`).

### Feature folder convention

```
features/<name>/
├── pages/          # Route components
├── components/     # Feature-specific components (not shared across features)
├── api/            # API layer (usersApi, etc.)
├── data/           # Mock seeds (mockUsers, mockOrders)
├── hooks/          # Feature-specific React Query hooks
├── store/          # Feature-specific Zustand stores (auth only so far)
├── types.ts        # Domain types
└── index.ts        # ★ Barrel — public surface of the feature
```

Other files should import from `@/features/<name>` (the barrel), not reach into internals. The one tolerated exception is `auth-store` importing `@/features/users/data/mock-users` directly to avoid a barrel cycle.

## Config layer — `src/config/`

Changing these files is how the template is customized. Never hardcode what belongs here:

| File | Owns |
|-|-|
| `app.ts` | App name, logo, login copy, demo credentials |
| `navigation.ts` | Sidebar menu (label, path, icon, feature flag) |
| `features.ts` | Feature flags — filter sidebar **and** routes |
| `feature-imports.ts` | Central lazy-import map (shared by routes + sidebar prefetch) |
| `locale.ts` | Currency, locale, date format defaults |
| `theme.ts` | Accent preset names + swatches |

Env vars (all `VITE_`-prefixed) feed into `src/shared/env.ts`, then into these configs. Users customize via `.env.local` (copy from `.env.example`).

## Adapter pattern

Anywhere the template might be swapped for a real implementation, the boundary is a single-file adapter. The only one today is **auth**:

```
features/auth/adapters/
├── auth-adapter.ts          # interface
├── mock-auth-adapter.ts     # default (localStorage-backed)
└── index.ts                 # export authAdapter: AuthAdapter = mockAuthAdapter
```

**To wire real auth:** implement `AuthAdapter`, change the single export in `index.ts`. The auth store, `ProtectedRoute`, and `http.ts` pick it up automatically.

Apply the same pattern for any other swappable layer (payments, storage, analytics…).

## HTTP client

`src/shared/lib/http.ts` — typed `fetch` wrapper.
- Prepends `VITE_API_URL`
- Injects `Authorization: Bearer <authAdapter.getToken()>` (pass `skipAuth: true` to opt out)
- Serializes JSON bodies, parses JSON responses
- Throws `HttpError` (class, fields: `status`, `statusText`, `body`) on non-2xx

Use it in feature API files: `http.get<T>('/path')`, `http.post<T>('/path', body)`, etc. The mock-based `features/*/api/*.ts` files each have a commented example of the HTTP version — uncomment and swap when going live.

## Theming

Accent colors are **CSS custom properties**, not hardcoded hex. Four presets defined in `src/index.css` under `@layer base`:

```css
.accent-zinc    { --accent-500: ...; --accent-600: ...; --accent-fg: ...; }
.dark.accent-zinc { ... }   /* dark-mode values of the same preset */
/* indigo / emerald / rose */
```

Tailwind utilities exposed: `bg-accent`, `bg-accent-hover`, `text-accent-fg`. Use these — don't introduce new hardcoded colors for primary actions.

Active preset is applied as a class on `<html>` by `shared/stores/theme-store.ts` and persisted in `localStorage`. Live-switchable under **Settings → Appearance**.

## Routing

- Login is eager; every `/admin/*` page is `React.lazy()`'d via `featureImports`
- Each lazy route is wrapped in `<ErrorBoundary>` (`shared/ui/error-boundary.tsx`) — a render error in one page won't blank the app
- The root `<ErrorBoundary>` in `app/App.tsx` catches anything deeper

Sidebar triggers `prefetchFeature(item.feature)` on `onMouseEnter` and `onFocus`, warming the chunk before the user clicks.

## Tests

- Co-locate: `foo.ts` ↔ `foo.test.ts`, `foo.tsx` ↔ `foo.test.tsx`
- Run: `npm test` (one-shot), `npm run test:watch`, `npm run test:ui`
- Vitest globals are enabled (`describe`, `it`, `expect`, `vi` work without import); `@testing-library/jest-dom` matchers are extended globally via `src/test/setup.ts`
- React Router components need `<MemoryRouter>` in tests; Zustand stores need manual reset in `beforeEach` because they're module-level singletons

There are four sample tests — one per layer (utility, UI component, store, layout). Use them as templates.

## Build & verification

- `npm run build` — always run before declaring work done. It's `tsc -b && vite build`, so type errors and bundle errors both surface.
- `npm test` — must pass
- The 500KB chunk warning on `index.js` is **cosmetic** — total eager payload is ~171 KB gzipped. Don't attempt to silence it by splitting vendor chunks; the current layout is intentional.

## Conventions / rules

1. **No comments explaining what the code does.** Only explain *why* when it's non-obvious. Don't add comments referencing past refactors, TODOs, or who-did-what.
2. **Don't invent fractional Tailwind classes** (`translate-x-5.5`, `w-1.5.5`). If you need precise offsets, use arbitrary values: `translate-x-[22px]`.
3. **Don't nest buttons inside buttons.** If an inner control needs to click, change the outer to `<div role="button">` with `tabIndex` + `onKeyDown`.
4. **Don't bypass the config layer.** If you're about to hardcode an app name, logo, nav item, currency, or color — stop and add it to `config/` instead.
5. **Never commit without running `npm run build` and `npm test`.**
6. **All barrel exports use named exports**, not default. `React.lazy()` wrappers convert to `{ default: ... }` in `feature-imports.ts`.
7. **When adding a lucide icon**, prefer one already imported in the same file over pulling a new one. The icon library is tree-shaken but per-file imports affect bundle granularity.
8. **Click-outside, async auth, and other shared behaviors have hooks/utilities** — check `shared/hooks/` and `shared/utils/` before re-implementing.

## Adding a new feature (recipe)

1. Create `src/features/<name>/` with at least `pages/<name>-page.tsx` and `index.ts` (barrel).
2. Barrel: `export { NamePage } from './pages/<name>-page'`.
3. Register the lazy import in `src/config/feature-imports.ts`:
   ```ts
   <name>: () => import('@/features/<name>'),
   ```
4. Add the route in `src/app/routes.tsx`:
   ```tsx
   const NamePage = lazy(() => featureImports.<name>().then((m: any) => ({ default: m.NamePage })))
   ...
   {features.<name> && <Route path="<name>" element={<Lazy><NamePage /></Lazy>} />}
   ```
5. Add a nav entry in `src/config/navigation.ts`.
6. Add the key to `src/config/features.ts` (default `true`).
7. Add at least one sample test in `features/<name>/`.
8. `npm test && npm run build` to verify.

No global state to wire, no cross-feature edits.

## Deleting a feature from a fork

1. Delete `src/features/<name>/`.
2. Remove its import from `src/config/feature-imports.ts`.
3. Remove its nav entry from `src/config/navigation.ts`.
4. Remove its key from `src/config/features.ts`.
5. Remove its route + `lazy()` declaration from `src/app/routes.tsx`.

The barrel import + feature-flag pattern makes this ~5 minutes.

## Known gaps (not bugs — deliberate scope)

- **No i18n** — all strings are English. Add when needed.
- **Mock auth + mock API** — real backends require adapter swaps (see above).
- **Per-route skeletons** — Suspense fallback is a plain spinner. Fine for now.

## Do NOT

- ...delete `config/` files thinking they're unused — they drive the whole template.
- ...wire `fetch()` directly in feature API files. Use `http` from `shared/lib/http.ts`.
- ...import from `@/features/X` inside `@/features/X`'s own barrel (circular).
- ...add dark-mode overrides in `index.css` for every new color. Use the existing `--color-accent-*` variables and the dark-mode preset pattern.
- ...silence type errors with `@ts-ignore`. Fix the root cause.
