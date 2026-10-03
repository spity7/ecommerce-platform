"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { loadPublishedCategories } from "@/lib/catalog";
import type { StorefrontCategoryItem } from "@/lib/mappers/catalog";
import {
  getStorefrontProductionNavItems,
  STOREFRONT_HEADER_CATEGORY_PREVIEW_LIMIT,
} from "@/lib/storefront-nav";
import { isPathActive } from "@/lib/nav";

const CATEGORY_MENU_ID = "production-shop-by-category";

type MobileMenuProductionProps = {
  onNavigate?: () => void;
};

export default function MobileMenuProduction({
  onNavigate,
}: MobileMenuProductionProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<StorefrontCategoryItem[]>([]);
  const [openMenuIds, setOpenMenuIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    void loadPublishedCategories(STOREFRONT_HEADER_CATEGORY_PREVIEW_LIMIT).then(
      (items) => {
        if (!cancelled) {
          setCategories(items);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const omitCategoriesLink = categories.length > 0;
  const navItems = getStorefrontProductionNavItems().filter(
    (item) => !(omitCategoriesLink && item.href === CATEGORIES_PAGE_PATH)
  );

  const toggleMenu = (id: string) => {
    setOpenMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const categoriesOpen = openMenuIds.has(CATEGORY_MENU_ID);

  return (
    <nav className="rbt-mainmenu-nav">
      <ul className="mainmenu">
        {navItems.map((item) => {
          const active = isPathActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={active ? "active" : undefined}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {categories.length > 0 ? (
          <li className="has-dropdown position-relative">
            <a
              href="#!"
              className={categoriesOpen ? "open" : ""}
              role="button"
              aria-expanded={categoriesOpen}
              onClick={(event) => {
                event.preventDefault();
                toggleMenu(CATEGORY_MENU_ID);
              }}
            >
              Shop by category <i className="fa-regular fa-chevron-down" />
            </a>
            <ul className={`submenu ${categoriesOpen ? "active" : ""}`}>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={category.href} onClick={onNavigate}>
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={CATEGORIES_PAGE_PATH} onClick={onNavigate}>
                  View all categories
                </Link>
              </li>
            </ul>
          </li>
        ) : (
          <li>
            <Link
              href={CATEGORIES_PAGE_PATH}
              className={
                isPathActive(pathname, CATEGORIES_PAGE_PATH)
                  ? "active"
                  : undefined
              }
              onClick={onNavigate}
            >
              Categories
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
