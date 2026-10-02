import VerifyEmail from "@/components/other-pages/VerifyEmail";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { Suspense } from "react";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Verify Email | ${site.seo.title}`,
  description: `Verify your ${site.name} account email address.`,
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
