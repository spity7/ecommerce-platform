import Signin from "@/components/other-pages/Signin";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Sign In | ${site.name}`,
  description: `Sign in to your ${site.name} account.`,
};

export default function SignInPage() {
  return <Signin />;
}
