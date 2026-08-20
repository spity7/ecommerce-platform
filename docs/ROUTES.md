# Routes reference

HTTP API routes, admin pages, and storefront routing. **Last reviewed:** 2026-08-20.

## Server API (`@platform/server`)

Base URL: `http://localhost:5000` (override with `API_URL`).

| Method | Path                  | Tag        | Notes                                              |
| ------ | --------------------- | ---------- | -------------------------------------------------- |
| GET    | `/api/health`         | health     | Liveness                                           |
| GET    | `/api/products`       | products   | Paginated list (`listProduct`)                     |
| POST   | `/api/products`       | products   | Create                                             |
| GET    | `/api/products/:id`   | products   | Get by ID                                          |
| PATCH  | `/api/products/:id`   | products   | Update                                             |
| DELETE | `/api/products/:id`   | products   | Delete                                             |
| GET    | `/api/categories`     | categories | Paginated list                                     |
| POST   | `/api/categories`     | categories | Create                                             |
| GET    | `/api/categories/:id` | categories | Get by ID                                          |
| PATCH  | `/api/categories/:id` | categories | Update                                             |
| DELETE | `/api/categories/:id` | categories | Delete                                             |
| GET    | `/api/brands`         | brands     | Paginated list                                     |
| POST   | `/api/brands`         | brands     | Create                                             |
| GET    | `/api/brands/:id`     | brands     | Get by ID                                          |
| PATCH  | `/api/brands/:id`     | brands     | Update                                             |
| DELETE | `/api/brands/:id`     | brands     | Delete                                             |
| GET    | `/api/attributes`     | attributes | Paginated list                                     |
| POST   | `/api/attributes`     | attributes | Create                                             |
| GET    | `/api/attributes/:id` | attributes | Get by ID                                          |
| PATCH  | `/api/attributes/:id` | attributes | Update                                             |
| DELETE | `/api/attributes/:id` | attributes | Delete                                             |
| POST   | `/api/uploads`        | uploads    | Multipart upload → GCS (503 if GCS not configured) |

**Docs:** Swagger UI at `/api/docs`, raw spec at `/api/openapi.json`.

**Security:** No authentication middleware — all routes are open. Do not expose publicly without adding auth.

**Implementation:** `server/src/routes/*.routes.ts`, registered in `server/src/routes/index.ts`.

---

## Admin (`@platform/admin`)

Dev URL: `http://localhost:3001`. Optional `basePath` via `NEXT_PUBLIC_BASE_URL` in `admin/next.config.ts`.

### Auth

| Path      | Notes                                         |
| --------- | --------------------------------------------- |
| `/signin` | Demo template only — **not wired to backend** |

### Dashboard (template + partial API)

| Path                                                                             | API-connected? | Notes                        |
| -------------------------------------------------------------------------------- | -------------- | ---------------------------- |
| `/`                                                                              | No             | Dashboard home (demo charts) |
| `/products`                                                                      | **Yes**        | List from API                |
| `/products/new`, `/products/demo/edit`                                           | No             | Template forms               |
| `/categories`                                                                    | **Yes**        | List from API                |
| `/categories/new`, `/categories/demo/edit`                                       | No             | Template forms               |
| `/brands`                                                                        | **Yes**        | List from API                |
| `/brands/new`, `/brands/demo/edit`                                               | No             | Template forms               |
| `/attributes`                                                                    | **Yes**        | List from API                |
| `/attributes/new`                                                                | No             | Template form                |
| `/orders`, `/orders/new`, `/orders/demo`, `/orders/demo/edit`                    | No             | Demo data                    |
| `/customers`, `/users/new`                                                       | No             | Demo data                    |
| `/coupons`, `/coupons/new`, `/coupons/demo/edit`                                 | No             | Demo data                    |
| `/roles`, `/roles/new`                                                           | No             | Demo data                    |
| `/reports`, `/tax`, `/media`, `/history`                                         | No             | Demo data                    |
| `/product-reviews`, `/support-tickets`, `/notifications`                         | No             | Demo data                    |
| `/integrations`, `/upgrade`, `/update-app`, `/list-page`                         | No             | Template pages               |
| `/settings`, `/settings/shipping`, `/settings/payments`, `/settings/permissions` | No             | Demo data                    |
| `/localization/currency-rates`, `/localization/translation`                      | No             | Demo data                    |

Navigation source: `admin/config/navigation.ts` + `admin/config/routes.ts`. Feature flags in site config are **not** yet used to hide nav items.

---

## Storefront (`@platform/storefront`)

Dev URL: `http://localhost:3000`.

### Production entry

| Path | Notes                                                                                       |
| ---- | ------------------------------------------------------------------------------------------- |
| `/`  | Renders site `homeLayout` via `HomeLayoutRenderer` (Beauty Station → `cosmetic-beauty-two`) |

### Theme demo surface

The storefront contains **many** demo routes under App Router groups — not all are used in production:

| Route group                                           | Purpose                        |
| ----------------------------------------------------- | ------------------------------ |
| `(homes)/`                                            | 80+ home layout variants       |
| `(shop)/`                                             | Shop listing layouts           |
| `(product-single)/`                                   | Product detail layouts         |
| `(core-features)/`                                    | Cart, checkout, builders       |
| `(other-pages)/`                                      | Blog, contact, signin, team, … |
| `(elements)/`, `(portfolios)/`, `(store)/`, `splash/` | UI demos                       |

**API integration today:** `home-cosmetic-beauty-two/Products1.tsx` fetches published products with static fallback. Most product UI reads from `client/data/products/*.ts`.

**Client state:** Zustand stores in `client/context/` (cart, wishlist, compare — persisted in browser only).

---

## Adding routes

| Layer          | Steps                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API**        | Zod schema in `@platform/shared` → register in `server/src/openapi/registry.ts` → handler in `server/src/routes/` → `npm run api:generate` → update this file |
| **Admin**      | Page under `admin/app/(dashboard)/` → add to `config/routes.ts` and `config/navigation.ts` → update this file                                                 |
| **Storefront** | Prefer reusing demo components; add production routes under `app/` → update this file if user-facing                                                          |
