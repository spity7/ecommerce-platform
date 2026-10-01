"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getSiteChromeBranding,
  type SiteChromeBranding,
} from "@/lib/site-branding";

const DEFAULT_WIDTH = 1487;
const DEFAULT_HEIGHT = 334;

export type SiteLogoProps = {
  variant?: "default" | "dark";
  branding?: SiteChromeBranding;
  className?: string;
  width?: number;
  height?: number;
};

export default function SiteLogo({
  variant = "default",
  branding,
  className,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SiteLogoProps) {
  const brand = branding ?? getSiteChromeBranding();
  const src = variant === "dark" ? brand.logoDark : brand.logo;

  return (
    <Link href="/" className={className}>
      <Image
        alt={`${brand.siteName} logo`}
        src={src}
        width={width}
        height={height}
      />
    </Link>
  );
}
