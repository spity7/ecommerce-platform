import Header13 from "@/components/headers/Header13";
import type { ComponentProps } from "react";

export type ProductionHeader13Props = Omit<
  ComponentProps<typeof Header13>,
  "navVariant"
>;

/** Layout wrapper for production home chrome; nav variant for modals comes from `StorefrontNavVariantRoot`. */
export function ProductionStorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export function ProductionHeader13(props: ProductionHeader13Props) {
  return <Header13 navVariant="production" {...props} />;
}
