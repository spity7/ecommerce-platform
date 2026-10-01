import type { UserDto } from "@platform/shared";

export const STOREFRONT_CHECKOUT_ADMIN_HINT =
  "Checkout is for customer accounts. Sign in with a customer account to place orders.";

export const STOREFRONT_WISHLIST_PAGE_ADMIN_HINT =
  "The full wishlist page is for customer accounts.";

export const STOREFRONT_CUSTOMER_ACCOUNT_HINT =
  "Available for customer accounts only.";

export function isStorefrontAdminSession(
  user: UserDto | null | undefined
): boolean {
  return user?.role === "admin";
}
