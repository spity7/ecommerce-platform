"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStorefrontProductionNavItems } from "@/lib/storefront-nav";
import { isPathActive } from "@/lib/nav";

export default function NavProduction() {
  const pathname = usePathname();
  const items = getStorefrontProductionNavItems();

  return (
    <>
      {items.map((item) => {
        const active = isPathActive(pathname, item.href);
        return (
          <li key={item.href} className={active ? "active" : undefined}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        );
      })}
    </>
  );
}
