# Nova Kit

Theme, component, and app-shell starter. Tailwind v4 (`radix-nova` shadcn style), oklch design tokens, the full set of base + composed UI components, layout, auth, and data-layer plumbing — ready to wire into a new app.

## What's here

- **Theme**: `src/index.css` (oklch tokens, `@theme inline` mapping, scrollbars), `components.json`
- **Components**: `src/components/ui/` — shadcn primitives + composed components (`app-table`, `data-table`, `filter-bar`, `form-*`, `page-container`, `sidebar`, etc.)
- **Layout**: `src/layouts/MainLayout.tsx` + `src/components/AppSidebar.tsx` / `AppTopbar.tsx`
- **Auth**: `src/stores/authStore.ts`, `src/components/guards/{GuestGuard,ProtectedRoute}.tsx`, `src/pages/auth/` (login page/form/schema/mutation). Token refresh is wired in `src/api/apiClient.ts`. Accept-invite flow was intentionally left out.
- **Data layer**: `src/api/apiClient.ts` (axios + auth header + 401 refresh-and-retry queue), `src/api/queryClient.ts` (React Query defaults)
- **Stores**: `src/stores/{authStore,alertStore,formStore}.ts` — `alertStore` drives toasts via `sonner`, `formStore` backs the dev-only autofill hook
- **Hooks**: `src/hooks/{use-mobile,useAutofill,usePaginatedTable}.ts`
- **Dev tooling**: `src/dev/forms/mock-registry.ts` — register per-form mock data, fetched by `useAutofill` (no-ops in production builds)
- **Page scaffolding**: `generate-folder.sh` / `folder-structure.md` — scaffolds a new `src/pages/<page-name>/` module (table, form, dialog, queries, schema)

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_BACKEND_URL at your API
npm run dev
```

Login lives at `/login`; everything else sits behind `ProtectedRoute` and `MainLayout`.
