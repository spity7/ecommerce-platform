# Routes reference

HTTP API routes, admin pages, and storefront routing. **Last reviewed:** 2026-08-22.

## Server API (`@platform/server`)

Base URL: `http://localhost:5000` (override with `API_URL`).

| Method | Path                      | Tag        | Notes                                              |
| ------ | ------------------------- | ---------- | -------------------------------------------------- |
| GET    | `/api/health`             | health     | Liveness                                           |
| GET    | `/api/products`           | products   | Paginated list (`listProduct`)                     |
| POST   | `/api/products`           | products   | Create                                             |
| GET    | `/api/products/:id`       | products   | Get by ID                                          |
| PATCH  | `/api/products/:id`       | products   | Update                                             |
| DELETE | `/api/products/:id`       | products   | Delete                                             |
| GET    | `/api/categories`         | categories | Paginated list                                     |
| POST   | `/api/categories`         | categories | Create                                             |
| GET    | `/api/categories/:id`     | categories | Get by ID                                          |
| PATCH  | `/api/categories/:id`     | categories | Update                                             |
| DELETE | `/api/categories/:id`     | categories | Delete                                             |
| GET    | `/api/brands`             | brands     | Paginated list                                     |
| POST   | `/api/brands`             | brands     | Create                                             |
| GET    | `/api/brands/:id`         | brands     | Get by ID                                          |
| PATCH  | `/api/brands/:id`         | brands     | Update                                             |
| DELETE | `/api/brands/:id`         | brands     | Delete                                             |
| GET    | `/api/attributes`         | attributes | Paginated list                                     |
| POST   | `/api/attributes`         | attributes | Create                                             |
| GET    | `/api/attributes/:id`     | attributes | Get by ID                                          |
| PATCH  | `/api/attributes/:id`     | attributes | Update                                             |
| DELETE | `/api/attributes/:id`     | attributes | Delete                                             |
| POST   | `/api/uploads`            | uploads    | Multipart upload → GCS (503 if GCS not configured) |
| POST   | `/api/auth/login`         | auth       | Login (public)                                     |
| POST   | `/api/auth/register`      | auth       | Register customer (public)                         |
| POST   | `/api/auth/refresh`       | auth       | Refresh tokens (public)                            |
| GET    | `/api/auth/me`            | auth       | Current user (Bearer token)                        |
| POST   | `/api/auth/logout`        | auth       | Logout (Bearer token)                              |
| GET    | `/api/cart`               | cart       | Current cart (Bearer or `X-Guest-Cart-Id`)         |
| POST   | `/api/cart/items`         | cart       | Add item                                           |
| PATCH  | `/api/cart/items/:itemId` | cart       | Update quantity                                    |
| DELETE | `/api/cart/items/:itemId` | cart       | Remove item                                        |
| DELETE | `/api/cart`               | cart       | Clear cart                                         |
| POST   | `/api/cart/merge`         | cart       | Merge guest cart on login (Bearer)                 |
| POST   | `/api/orders`             | orders     | Place order from cart (Bearer)                     |
| GET    | `/api/orders`             | orders     | List orders (user; admin sees all)                 |
| GET    | `/api/orders/:id`         | orders     | Order detail (owner or admin)                      |
| PATCH  | `/api/orders/:id`         | orders     | Update status (admin)                              |
| PATCH  | `/api/users/me`           | users      | Update profile (name, phone)                       |

**Docs:** Swagger UI at `/api/docs`, raw spec at `/api/openapi.json`.

**Security:** Catalog **GET** routes are public. Catalog **POST/PATCH/DELETE** and **uploads** require admin JWT. Cart routes accept guest `X-Guest-Cart-Id` or user Bearer token. Orders and profile updates require Bearer token; order status updates require admin.

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

| Path                                                                             | API-connected? | Notes                          |
| -------------------------------------------------------------------------------- | -------------- | ------------------------------ |
| `/`                                                                              | No             | Dashboard home (demo charts)   |
| `/products`                                                                      | **Yes**        | List + delete from API         |
| `/products/new`, `/products/[id]/edit`                                           | **Yes**        | Create/update via API          |
| `/categories`                                                                    | **Yes**        | List + delete from API         |
| `/categories/new`, `/categories/[id]/edit`                                       | **Yes**        | Create/update via API          |
| `/brands`                                                                        | **Yes**        | List + delete from API         |
| `/brands/new`, `/brands/[id]/edit`                                               | **Yes**        | Create/update via API          |
| `/attributes`                                                                    | **Yes**        | List + delete from API         |
| `/attributes/new`, `/attributes/[id]/edit`                                       | **Yes**        | Create/update via API          |
| `/products/demo/edit`, `/categories/demo/edit`, …                                | No             | Legacy demo routes (optional)  |
| `/orders`                                                                        | **Yes**        | List + status updates from API |
| `/customers`, `/users/new`                                                       | No             | Demo data                      |
| `/coupons`, `/coupons/new`, `/coupons/demo/edit`                                 | No             | Demo data                      |
| `/roles`, `/roles/new`                                                           | No             | Demo data                      |
| `/reports`, `/tax`, `/media`, `/history`                                         | No             | Demo data                      |
| `/product-reviews`, `/support-tickets`, `/notifications`                         | No             | Demo data                      |
| `/integrations`, `/upgrade`, `/update-app`, `/list-page`                         | No             | Template pages                 |
| `/settings`, `/settings/shipping`, `/settings/payments`, `/settings/permissions` | No             | Demo data                      |
| `/localization/currency-rates`, `/localization/translation`                      | No             | Demo data                      |

Navigation source: `admin/config/navigation.ts` + `admin/config/routes.ts`. Optional nav items are hidden when matching `SiteConfig.features` is `false` (e.g. `coupons`, `reviews`).

---

## Storefront (`@platform/storefront`)

Dev URL: `http://localhost:3000`.

### Production entry

| Path              | Notes                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `/`               | Renders site `homeLayout` via `HomeLayoutRenderer` (Beauty Station → `cosmetic-beauty-two`) |
| `/shop`           | Published products from API with static fallback (`ShopDefault`)                            |
| `/product/[slug]` | Product detail from API by slug with static fallback                                        |
| `/checkout`       | Production checkout (shipping form + place order) when `features.customerAuth`              |

**API integration today:** Home `Products1`, `/shop`, and `/product/[slug]` fetch published products from the API with static fallback. Demo routes under `(shop)/` and `(product-single)/` remain for theme previews.

**Client state:** Zustand cart/wishlist/compare in `client/context/` (browser persisted). Server cart API available when `features.customerAuth` is enabled; guest carts use `X-Guest-Cart-Id` and merge on login.

### Customer auth (when `features.customerAuth`)

| Path                                    | Notes                                                    |
| --------------------------------------- | -------------------------------------------------------- |
| `/signin`, `/signup`                    | API login/register; site-branded forms                   |
| `/account-info`, `/my-order-history`, … | Protected by `client/proxy.ts` when feature enabled      |
| `/my-order-history`                     | Loads orders from `GET /api/orders` when feature enabled |

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
