import ForgotPassword from "@/components/other-pages/ForgotPassword";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Forgot Password | ${site.seo.title}`,
  description: `Recover access to your ${site.name} account.`,
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
