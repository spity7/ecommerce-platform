import { ApiOrderDetailPanel } from "@/components/orders/api-order-detail-panel";
import { getAdminSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getAdminSiteConfig();

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Order ${id.slice(-8).toUpperCase()} | ${site.name} Admin`,
  };
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <ApiOrderDetailPanel orderId={id} />;
}
