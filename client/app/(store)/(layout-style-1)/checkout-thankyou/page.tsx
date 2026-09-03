import CheckoutComplete from "@/components/store/CheckoutComplete";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import Testimonials from "@/components/homes/home-phone-case/Testimonials";
import SimilerProducts from "@/components/product-details/others/SimilerProducts";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Checkout Thank You | ${site.name}`,
  description: `Your ${site.name} order confirmation.`,
};

export default function page() {
  const showRecommendations = !site.features.customerAuth;

  return (
    <>
      <Breadcrumb title="Checkout Thank You" subtitle="Checkout" />
      <Suspense fallback={<p className="container mb--0">Loading…</p>}>
        <CheckoutComplete />
      </Suspense>
      {showRecommendations ? (
        <>
          <Testimonials />
          <SimilerProducts parentClass="rbt-component-area rbt-section-gap rbt-bg-color-gray-white" />
        </>
      ) : null}
    </>
  );
}
