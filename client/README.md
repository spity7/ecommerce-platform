# Storefront (`@platform/storefront`)

Next.js storefront for the ecommerce platform. Folder name: `client/`. Runs on **port 3000** in development.

Part of the monorepo — run commands from **repo root** unless noted. Platform docs: [AGENTS.md](../AGENTS.md), [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/CONVENTIONS.md](../docs/CONVENTIONS.md).

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Bootstrap 5 + Sass, Swiper, GSAP, Lightgallery
- Zustand (cart, wishlist, compare — browser persistence)
- `@platform/site-config` for multi-site theming and home layout

## Prerequisites

- Node.js **20.x**

## Development

From repo root:

```bash
npm run dev:client
```

Webpack instead of Turbopack:

```bash
npm run dev:webpack -w @platform/storefront
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `client/.env.example` → `client/.env.local`:

- `NEXT_PUBLIC_SITE_ID` — site config (default `beauty-station`)
- `NEXT_PUBLIC_API_URL` — backend for API-integrated blocks

## Scripts

| Command                                       | Purpose                |
| --------------------------------------------- | ---------------------- |
| `npm run dev -w @platform/storefront`         | Dev server (Turbopack) |
| `npm run dev:webpack -w @platform/storefront` | Dev with Webpack       |
| `npm run build -w @platform/storefront`       | Production build       |
| `npm run lint -w @platform/storefront`        | ESLint                 |
| `npm run analyze -w @platform/storefront`     | Bundle analyzer        |
| `npm run rebrand -w @platform/storefront`     | Rebrand helper script  |

## Project structure

```text
app/              App Router — many theme demo route groups
components/       UI blocks, home sections, modals, site shell
context/          Zustand stores (cart, wishlist, ui)
data/             Static demo catalog (products, blogs, …)
hooks/            Custom React hooks
lib/              Site config, utilities
public/           Images, fonts, SCSS
```

## Production vs demo

- **`/`** renders the site-specific home layout (`HomeLayoutRenderer` → Beauty Station uses `cosmetic-beauty-two`).
- **~300 demo routes** under `(homes)`, `(shop)`, `(product-single)`, etc. — theme showcase, not all production paths.
- **API:** partial integration on Beauty home (`Products1.tsx` tries API, falls back to static `data/*`).
- **Tab filtering:** see `.cursor/rules/product-tab-filtering-pattern.mdc`.

## Common tasks

### Add a production page

1. Create a route under `app/`.
2. Reuse components from `components/`.
3. Prefer static data in `data/` for demos; use `@platform/api-client` only when wiring real catalog.

### Add a modal

1. Component under `components/modals/`.
2. Register in `components/common/other-components/LayoutModals.tsx`.
3. Wire open/close in `context/uiStore.ts`.

## Quality

```bash
npm run lint -w @platform/storefront
npm run build -w @platform/storefront
```

## Deployment

Standard Next.js production flow. Client includes a multi-stage `Dockerfile` (note: verify Node version matches repo `engines`).

## Troubleshooting

- Unexpected dev behavior: delete `client/.next/` and restart.
- SCSS not refreshing: restart dev server.
- After dependency changes: `npm install` from repo root.
