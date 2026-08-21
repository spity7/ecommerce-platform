import BreadcrumbInner from "@/components/common/other-components/BreadcrumbInner";
import PortfolioDetails from "@/components/portfolios/PortfolioDetails";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Details | Beauty Station | Cosmetics & Skincare",
  description: "Detailed portfolio/project page layout for Beauty Station.",
};

export default function page() {
  return (
    <>
      <BreadcrumbInner title="Portfolio Details" />
      <PortfolioDetails />
    </>
  );
}
