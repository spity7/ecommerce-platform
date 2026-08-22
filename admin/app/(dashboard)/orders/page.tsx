import { PageHeader } from "@/components/layout/page-header";
import { ApiOrdersPanel } from "@/components/orders/api-orders-panel";
import { getAdminSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getAdminSiteConfig();

export const metadata: Metadata = {
  title: `Orders | ${site.name} Admin`,
};

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        description="Review and update customer orders from the live API."
        eyebrow="Operations"
        title="Orders Listing"
      />
      <ApiOrdersPanel />
    </>
  );
}
