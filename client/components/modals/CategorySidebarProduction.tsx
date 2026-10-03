"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useManagedModalPanel } from "@/hooks/useManagedModalPanel";
import SiteLogo from "@/components/site/SiteLogo";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { loadPublishedCategories } from "@/lib/catalog";
import type { StorefrontCategoryItem } from "@/lib/mappers/catalog";
import { getSiteContactInfo } from "@/lib/site-branding";
import {
  getStorefrontProductionNavItems,
  STOREFRONT_HEADER_CATEGORY_PREVIEW_LIMIT,
} from "@/lib/storefront-nav";
import { getStackedModalZIndex } from "@/lib/modalStack";

export default function CategorySidebarProduction() {
  const contact = getSiteContactInfo();
  const quickLinks = getStorefrontProductionNavItems().filter(
    (item) => item.href !== CATEGORIES_PAGE_PATH
  );
  const { activeBsModal, isAnimatedOpen, close } =
    useManagedModalPanel("categorySidebar");
  const [categories, setCategories] = useState<StorefrontCategoryItem[]>([]);
  const categorySidebarOpen = isAnimatedOpen;
  const categorySidebarLayerZIndex = getStackedModalZIndex(
    activeBsModal,
    "categorySidebar"
  );

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

  return (
    <div
      className={`rbt-offcanvas-cat-side-menu rbt-category-sidemenu${categorySidebarOpen ? " side-menu-active" : ""}`}
      style={{
        zIndex: categorySidebarLayerZIndex,
      }}
    >
      <div className="inner-wrapper">
        <div className="rbt-categories-sidebar d-flex flex-column">
          <div className="rbt-sidebar-left-content w-100">
            <div className="rbt-sidebar-left-inner">
              <div className="rbt-sidebar-left-content-head">
                <div className="rbt-categories-sidebar-top-content mb--24">
                  <div className="logo">
                    <SiteLogo />
                  </div>
                  <button
                    className="rbt-sidebar-close-btn"
                    type="button"
                    onClick={() => close()}
                  >
                    <i className="fa-sharp fa-solid fa-xmark" />
                  </button>
                </div>
              </div>
              <nav className="rbt-sidebar-nav px--20 pb--16">
                <h6 className="rbt-sub-category-title mb--12">Categories</h6>
                {categories.length > 0 ? (
                  <ul className="rbt-sidebar-quick-links">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link href={category.href} onClick={() => close()}>
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rbt-contact-text mb--12">
                    No categories published yet.
                  </p>
                )}
                <Link
                  className="rbt-btn rbt-btn-sm mt--12"
                  href={CATEGORIES_PAGE_PATH}
                  onClick={() => close()}
                >
                  View all categories
                </Link>
                <hr className="rbt-separator rbt-separator-gray200 my--24" />
                <h6 className="rbt-sub-category-title mb--12">Quick links</h6>
                <ul className="rbt-sidebar-quick-links">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => close()}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="rbt-sidebar-left-content-footer px--20 pb--24">
                <div className="rbt-sidebar-contact-area">
                  <div className="rbt-sidebar-contact-inner rbt-link-hover">
                    {contact.phoneHref ? (
                      <a className="rbt-contact-links" href={contact.phoneHref}>
                        {contact.phone}
                      </a>
                    ) : null}
                    {contact.emailHref ? (
                      <a
                        className="rbt-contact-links d-block mt--8"
                        href={contact.emailHref}
                      >
                        {contact.email}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
