import Breadcrumb from "@/components/products/Breadcrumb";
import StorefrontCheckout from "@/components/store/StorefrontCheckout";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Checkout | ${site.seo.title}`,
  description: `Complete your ${site.name} order.`,
};

export default function CheckoutPage() {
  return (
    <>
      <Breadcrumb title="Checkout" />
      <div className="rbt-component-area rbt-section-gap rbt-bg-color-white">
        <div className="container">
          <StorefrontCheckout />
        </div>
      </div>
    </>
  );
}
