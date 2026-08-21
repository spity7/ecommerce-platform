# Routes reference

HTTP API routes, admin pages, and storefront routing. **Last reviewed:** 2026-08-21.

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
| POST   | `/api/auth/login`     | auth       | Login (public)                                     |
| POST   | `/api/auth/register`  | auth       | Register customer (public)                         |
| POST   | `/api/auth/refresh`   | auth       | Refresh tokens (public)                            |
| GET    | `/api/auth/me`        | auth       | Current user (Bearer token)                        |
| POST   | `/api/auth/logout`    | auth       | Logout (Bearer token)                              |

**Docs:** Swagger UI at `/api/docs`, raw spec at `/api/openapi.json`.

**Security:** Catalog **GET** routes are public. Catalog **POST/PATCH/DELETE** and **uploads** require admin JWT (`Authorization: Bearer <token>`). Auth login/register/refresh are public.

**Implementation:** `server/src/routes/*.routes.ts`, registered in `server/src/routes/index.ts`.

---

## Admin (`@platform/admin`)

Dev URL: `http://localhost:3001`. Optional `basePath` via `NEXT_PUBLIC_BASE_URL` in `admin/next.config.ts`.

### Auth

| Path      | Notes                                |
| --------- | ------------------------------------ |
| `/signin` | JWT login via API; sets auth cookies |

Protected by `admin/proxy.ts`: validates access token via `GET /api/auth/me` and requires `role: admin`. Clears invalid cookies and redirects to `/signin`. Sign-in rejects non-admin users. Logout calls `POST /api/auth/logout`. Failed token refresh clears session and redirects to sign-in.

### Dashboard (template + catalog API)

| Path                                                                             | API-connected? | Notes                         |
| -------------------------------------------------------------------------------- | -------------- | ----------------------------- |
| `/`                                                                              | No             | Dashboard home (demo charts)  |
| `/products`                                                                      | **Yes**        | List + delete from API        |
| `/products/new`, `/products/[id]/edit`                                           | **Yes**        | Create/update via API         |
| `/categories`                                                                    | **Yes**        | List + delete from API        |
| `/categories/new`, `/categories/[id]/edit`                                       | **Yes**        | Create/update via API         |
| `/brands`                                                                        | **Yes**        | List + delete from API        |
| `/brands/new`, `/brands/[id]/edit`                                               | **Yes**        | Create/update via API         |
| `/attributes`                                                                    | **Yes**        | List + delete from API        |
| `/attributes/new`, `/attributes/[id]/edit`                                       | **Yes**        | Create/update via API         |
| `/products/demo/edit`, `/categories/demo/edit`, …                                | No             | Legacy demo routes (optional) |
| `/orders`, `/orders/new`, `/orders/demo`, `/orders/demo/edit`                    | No             | Demo data                     |
| `/customers`, `/users/new`                                                       | No             | Demo data                     |
| `/coupons`, `/coupons/new`, `/coupons/demo/edit`                                 | No             | Demo data                     |
| `/roles`, `/roles/new`                                                           | No             | Demo data                     |
| `/reports`, `/tax`, `/media`, `/history`                                         | No             | Demo data                     |
| `/product-reviews`, `/support-tickets`, `/notifications`                         | No             | Demo data                     |
| `/integrations`, `/upgrade`, `/update-app`, `/list-page`                         | No             | Template pages                |
| `/settings`, `/settings/shipping`, `/settings/payments`, `/settings/permissions` | No             | Demo data                     |
| `/localization/currency-rates`, `/localization/translation`                      | No             | Demo data                     |

Navigation source: `admin/config/navigation.ts` + `admin/config/routes.ts`. Feature flags in site config are **not** yet used to hide nav items.

---

## Storefront (`@platform/storefront`)

Dev URL: `http://localhost:3000`.

### Production entry

| Path              | Notes                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `/`               | Renders site `homeLayout` via `HomeLayoutRenderer` (Beauty Station → `cosmetic-beauty-two`) |
| `/shop`           | Published products from API with static fallback (`ShopDefault`)                            |
| `/product/[slug]` | Product detail from API by slug with static fallback                                        |

**API integration today:** Home `Products1`, `/shop`, and `/product/[slug]` fetch published products from the API with static fallback. Demo routes under `(shop)/` and `(product-single)/` remain for theme previews.

**Client state:** Zustand stores in `client/context/` (cart, wishlist, compare — persisted in browser only).

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

---

## Adding routes

| Layer          | Steps                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API**        | Zod schema in `@platform/shared` → register in `server/src/openapi/registry.ts` → handler in `server/src/routes/` → `npm run api:generate` → update this file |
| **Admin**      | Page under `admin/app/(dashboard)/` → add to `config/routes.ts` and `config/navigation.ts` → update this file                                                 |
| **Storefront** | Prefer reusing demo components; add production routes under `app/` → update this file if user-facing                                                          |
