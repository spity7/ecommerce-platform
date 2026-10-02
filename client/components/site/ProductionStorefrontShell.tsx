import Header13 from "@/components/headers/Header13";
import { StorefrontNavVariantProvider } from "@/providers/storefront-nav-variant-provider";
import type { ComponentProps } from "react";

export type ProductionHeader13Props = Omit<
  ComponentProps<typeof Header13>,
  "navVariant"
>;

/** Keeps mobile menu and Header13 on the same production nav mode. */
export function ProductionStorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StorefrontNavVariantProvider variant="production">
      {children}
    </StorefrontNavVariantProvider>
  );
}

export function ProductionHeader13(props: ProductionHeader13Props) {
  return <Header13 navVariant="production" {...props} />;
}
