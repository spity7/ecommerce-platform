"use client";

import { useSearchParams } from "next/navigation";
import { getStorefrontSiteConfig } from "@/lib/site";
import CheckoutCompleteDemo from "./CheckoutCompleteDemo";
import StorefrontCheckoutComplete from "./StorefrontCheckoutComplete";

export default function CheckoutComplete() {
  const site = getStorefrontSiteConfig();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (site.features.customerAuth && orderId) {
    return <StorefrontCheckoutComplete orderId={orderId} />;
  }

  return <CheckoutCompleteDemo />;
}
