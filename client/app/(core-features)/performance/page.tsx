import { Metadata } from "next";
import PerformanceBanner from "@/components/core-features/performance/PerformanceBanner";
import PerformanceComponents from "@/components/core-features/performance/PerformanceComponents";
export const metadata: Metadata = {
  title: "Performance | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function PerformancePage() {
  return (
    <>
      <PerformanceBanner />
      <PerformanceComponents />
    </>
  );
}
