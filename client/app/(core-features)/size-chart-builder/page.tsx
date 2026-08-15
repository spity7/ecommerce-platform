import { Metadata } from "next";
import SizeChartBuilderBanner from "@/components/core-features/size-chart-builder/SizeChartBuilderBanner";
import SizeChartBuilderComponents from "@/components/core-features/size-chart-builder/SizeChartBuilderComponents";
export const metadata: Metadata = {
  title:
    "Size Chart Builder | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function SizeChartBuilderPage() {
  return (
    <>
      <SizeChartBuilderBanner />
      <SizeChartBuilderComponents />
    </>
  );
}
