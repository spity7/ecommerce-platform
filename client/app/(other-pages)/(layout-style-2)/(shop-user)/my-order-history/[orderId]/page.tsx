import OrderDetailPanel from "@/components/other-pages/shop-user/OrderDetailPanel";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";
import Sidebar from "@/components/other-pages/shop-user/Sidebar";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Order ${orderId.slice(-8).toUpperCase()} | ${site.name}`,
    description: `View your ${site.name} order details.`,
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-100"
        title="Order Details"
        subtitle="Profile"
      />
      <div className="rbt-component-area rbt-section-gap rbt-bg-color-gray-light">
        <div className="container">
          <div className="row row--12 mt_dec--24">
            <div className="col-12 col-md-12 col-lg-4 col-xl-3 mt--24">
              <Sidebar />
            </div>
            <div className="col-12 col-md-12 col-lg-8 col-xl-9 mt--24">
              <OrderDetailPanel orderId={orderId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
