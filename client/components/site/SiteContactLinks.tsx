import type { ReactNode } from "react";
import { getSiteContactInfo } from "@/lib/site-branding";

type SiteContactLinkProps = {
  className?: string;
  children?: ReactNode;
};

/** Mailto link from `SiteConfig.contact.email` (multi-site safe). */
export function SiteContactEmailLink({
  className,
  children,
}: SiteContactLinkProps) {
  const { email, emailHref } = getSiteContactInfo();
  if (!emailHref) {
    return null;
  }

  return (
    <a href={emailHref} className={className}>
      {children ?? email}
    </a>
  );
}

/** Tel link from `SiteConfig.contact.phone` (multi-site safe). */
export function SiteContactPhoneLink({
  className,
  children,
}: SiteContactLinkProps) {
  const { phone, phoneHref } = getSiteContactInfo();
  if (!phoneHref) {
    return null;
  }

  return (
    <a href={phoneHref} className={className}>
      {children ?? phone}
    </a>
  );
}
