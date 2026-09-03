import { getStorefrontSiteConfig } from "@/lib/site";

export function getCheckoutPath(): string {
  const site = getStorefrontSiteConfig();
  return site.features.customerAuth
    ? "/checkout"
    : "/checkout-delivery-step-one";
}

export function getCheckoutThankYouPath(orderId?: string): string {
  if (!orderId) {
    return "/checkout-thankyou";
  }

  const params = new URLSearchParams({ orderId });
  return `/checkout-thankyou?${params.toString()}`;
}
