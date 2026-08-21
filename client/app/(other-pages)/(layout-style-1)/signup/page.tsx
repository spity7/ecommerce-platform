import Signup from "@/components/other-pages/Signup";
import { getStorefrontSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const site = getStorefrontSiteConfig();

export const metadata: Metadata = {
  title: `Sign Up | ${site.name}`,
  description: `Create your ${site.name} customer account.`,
};

export default function SignUpPage() {
  return <Signup />;
}
