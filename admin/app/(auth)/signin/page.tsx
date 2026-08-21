import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { createAdminMetadata } from "@/lib/brand";
import { baseURL } from "@/utils/cn";

export const metadata: Metadata = createAdminMetadata("Sign In");

export default function SignInPage() {
  return (
    <>
      <Link
        aria-label={`${siteConfig.displayName} dashboard`}
        className="inline-flex items-center lg:hidden mb-4"
        href={routes.dashboard}
      >
        <Image
          alt={siteConfig.displayName}
          className="h-9 w-auto"
          height={36}
          priority
          src={`${baseURL}${siteConfig.branding.logo.replace(/^\//, "")}`}
          style={{ width: "auto" }}
          width={160}
        />
      </Link>
      <SignInForm />
    </>
  );
}
