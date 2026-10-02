import ResetPassword from "@/components/other-pages/ResetPassword";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Reset Password | ${site.seo.title}`,
  description: `Set a new password for your ${site.name} account.`,
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
