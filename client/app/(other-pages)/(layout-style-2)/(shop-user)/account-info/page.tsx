import AccountInfoPageClient from "@/components/other-pages/shop-user/AccountInfoPageClient";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Account Info | ${site.name}`,
  description: `View and update your ${site.name} account information.`,
};

export default function AccountInfoPage() {
  return (
    <>
      <div className="rbt-component-area rbt-section-gap rbt-bg-color-gray-light">
        <div className="container">
          <AccountInfoPageClient />
        </div>
      </div>
    </>
  );
}
