import ResetPassword from "@/components/other-pages/ResetPassword";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | Beauty Station | Cosmetics & Skincare",
  description: "Set a new password for your Beauty Station account.",
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
