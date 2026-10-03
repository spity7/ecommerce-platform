import CheckoutComplete from "@/components/store/CheckoutComplete";
import Breadcrumb from "@/components/products/Breadcrumb";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Order confirmation | ${site.seo.title}`,
  description: `Your ${site.name} order confirmation.`,
};

export default function CheckoutThankYouPage() {
  return (
    <>
      <Breadcrumb title="Thank you" />
      <Suspense fallback={<p className="container mb--0">Loading…</p>}>
        <CheckoutComplete />
      </Suspense>
    </>
  );
}
