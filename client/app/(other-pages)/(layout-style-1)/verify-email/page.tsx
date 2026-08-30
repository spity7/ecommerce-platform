import VerifyEmail from "@/components/other-pages/VerifyEmail";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email | Beauty Station | Cosmetics & Skincare",
  description: "Verify your Beauty Station account email address.",
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
