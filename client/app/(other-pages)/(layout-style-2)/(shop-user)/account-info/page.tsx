import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import Sidebar from "@/components/other-pages/shop-user/Sidebar";
import AccountInfoPanel from "@/components/other-pages/shop-user/AccountInfoPanel";
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
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-100"
        title="Account Info"
        subtitle="Profile"
      />
      <div className="rbt-component-area rbt-section-gap rbt-bg-color-gray-light">
        <div className="container">
          <div className="row row--12 mt_dec--24">
            <div className="col-12 col-md-12 col-lg-4 col-xl-3 mt--24">
              <Sidebar />
            </div>
            <div className="col-12 col-md-12 col-lg-8 col-xl-9 mt--24">
              <AccountInfoPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
