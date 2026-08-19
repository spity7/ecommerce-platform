# Admin dashboard (`@platform/admin`)

Next.js admin UI for the ecommerce platform. Runs on **port 3001** in development.

Part of the monorepo — run commands from **repo root** unless noted. Platform docs: [AGENTS.md](../AGENTS.md), [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/ROUTES.md](../docs/ROUTES.md).

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Lucide icons, ECharts
- `@platform/api-client` for catalog API calls

## Prerequisites

- Node.js **20.x**
- MongoDB seeded (`npm run seed` from root) for catalog list pages

## Development

From repo root:

```bash
npm run dev:admin
```

Open [http://localhost:3001](http://localhost:3001).

`predev` runs `api:ensure` and `build:packages` automatically.

## Environment

Copy `admin/.env.example` → `admin/.env.local`:

- `NEXT_PUBLIC_SITE_ID` — site config (default `beauty-station`)
- `NEXT_PUBLIC_API_URL` — backend (default `http://localhost:5000`)
- `NEXT_PUBLIC_BASE_URL` — optional subdirectory `basePath`

## Scripts

| Command                            | Purpose               |
| ---------------------------------- | --------------------- |
| `npm run dev -w @platform/admin`   | Dev server (:3001)    |
| `npm run build -w @platform/admin` | Production build      |
| `npm run check -w @platform/admin` | Prettier + Biome lint |
| `npm run lint -w @platform/admin`  | Biome only            |

## Project structure

```text
app/
  (auth)/signin/          Demo sign-in (not wired to backend)
  (dashboard)/            Dashboard pages
config/                   routes.ts, navigation.ts, site.ts
components/               layout, products, charts, ui, …
lib/                      site helpers, API mappers
providers/                app providers
```

## API integration

**Connected today:** catalog list pages only — products, categories, brands, attributes (Server Components + `@platform/api-client`).

**Template only:** orders, customers, coupons, settings, reports, and most other nav items use demo data. See [docs/ROUTES.md](../docs/ROUTES.md).

## Auth

Authentication is **not implemented**. The sign-in page is a UI template with no backend session. Do not deploy admin publicly without adding auth.

## Conventions

- Navigation: `config/routes.ts` + `config/navigation.ts`
- Styling: semantic Tailwind tokens in `app/globals.css`
- Cursor rules: `.cursor/rules/admin-ui.mdc`

## Quality

```bash
npm run check -w @platform/admin
npm run build -w @platform/admin
```

Root CI runs `api:check`, `build:packages`, and `typecheck` — not admin lint/build yet.
