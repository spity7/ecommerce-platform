import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { baseURL } from "@/utils/cn";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const signInBanner = siteConfig.branding.signInBanner;
  const signInBannerMobile = siteConfig.branding.signInBannerMobile;
  const logo = siteConfig.branding.logo;

  return (
    <main className="grid min-h-screen bg-surface-body lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1fr)]">
      <section className="hidden bg-gradient-to-b from-brand-600 to-admin-sidebar-dark p-10 text-white lg:flex lg:flex-col relative">
        <Link
          aria-label={`${siteConfig.displayName} dashboard`}
          className="inline-flex items-center relative z-1"
          href={routes.dashboard}
        >
          <Image
            alt={siteConfig.displayName}
            className="h-10 w-auto"
            height={40}
            priority
            src={`${baseURL}${logo.replace(/^\//, "")}`}
            style={{ width: "auto", height: "auto" }}
            width={178}
          />
        </Link>

        {signInBanner ? (
          <Image
            src={`${baseURL}${signInBanner.replace(/^\//, "")}`}
            alt={`${siteConfig.displayName} sign-in`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            unoptimized
          />
        ) : null}
      </section>
      <section className="flex items-center justify-center px-4 py-10 bg-[linear-gradient(to_bottom,#bed0fa,#79a4fa)] lg:bg-[linear-gradient(to_bottom,transparent,transparent)] relative">
        {signInBannerMobile ? (
          <Image
            className="lg:hidden object-cover"
            src={`${baseURL}${signInBannerMobile.replace(/^\//, "")}`}
            alt={`${siteConfig.displayName} sign-in`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            unoptimized
          />
        ) : null}
        {children}
      </section>
    </main>
  );
}
