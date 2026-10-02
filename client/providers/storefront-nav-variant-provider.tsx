"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StorefrontNavVariant } from "@/lib/storefront-nav";

const StorefrontNavVariantContext = createContext<StorefrontNavVariant>("demo");

type StorefrontNavVariantProviderProps = {
  variant: StorefrontNavVariant;
  children: ReactNode;
};

export function StorefrontNavVariantProvider({
  variant,
  children,
}: StorefrontNavVariantProviderProps) {
  return (
    <StorefrontNavVariantContext.Provider value={variant}>
      {children}
    </StorefrontNavVariantContext.Provider>
  );
}

export function useStorefrontNavVariant(): StorefrontNavVariant {
  return useContext(StorefrontNavVariantContext);
}
