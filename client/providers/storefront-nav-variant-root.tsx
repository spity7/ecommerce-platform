"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { resolveStorefrontNavVariant } from "@/lib/storefront-nav";
import { StorefrontNavVariantProvider } from "@/providers/storefront-nav-variant-provider";

/**
 * Supplies nav variant to layout modals (mobile menu, category drawer) and toolbar.
 * Must wrap `LayoutModals` as well as page content — not only `StorefrontChrome`.
 */
export function StorefrontNavVariantRoot({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const variant = resolveStorefrontNavVariant(pathname ?? "/");

  return (
    <StorefrontNavVariantProvider variant={variant}>
      {children}
    </StorefrontNavVariantProvider>
  );
}
