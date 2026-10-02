"use client";

import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { CATEGORIES_PAGE_PATH } from "@/lib/category-paths";
import { getStorefrontHeaderAnnouncements } from "@/lib/storefront-header-content";

function announcementLinkLabel(href: string): string {
  if (href.startsWith("mailto:")) {
    return "Email us";
  }
  if (href === "/shop") {
    return "Shop Now";
  }
  if (href === CATEGORIES_PAGE_PATH) {
    return "Browse";
  }
  return "Learn more";
}

type StorefrontHeaderTopbarProps = {
  position?: string;
  color?: string;
  hasFancyText?: boolean;
  /** Disambiguates Swiper nav controls when multiple topbars mount in Header13. */
  navigationKey: "primary" | "sticky";
};

export default function StorefrontHeaderTopbar({
  position = "center",
  color = "white",
  hasFancyText = false,
  navigationKey,
}: StorefrontHeaderTopbarProps) {
  const prevClass = `rbt-announce-prev-${navigationKey}`;
  const nextClass = `rbt-announce-next-${navigationKey}`;
  const announcements = getStorefrontHeaderAnnouncements();

  return (
    <Swiper
      className="rbt-text-swiper-container rbt-arrow-vertical"
      loop={announcements.length > 1}
      slidesPerView={1}
      direction="vertical"
      effect="slide"
      autoplay={{
        delay: 2000,
        reverseDirection: true,
        disableOnInteraction: false,
      }}
      navigation={{
        prevEl: `.${prevClass}`,
        nextEl: `.${nextClass}`,
      }}
      modules={[Navigation, Autoplay]}
    >
      {announcements.map((item, index) => (
        <SwiperSlide key={`${item.text}-${index}`} className="swiper-slide">
          <div
            className={`rbt-fancy-item fancy-menu-text fancy-menu-${position}`}
          >
            <span
              className={`mr--4 rbt-fancy-text ${hasFancyText ? "rbt-fancy-text" : ""} rbt-text-color-${color}`}
            >
              <i className="fa-sharp fa-solid fa-bolt" />
            </span>
            <span
              className={`rbt-fancy-text ${hasFancyText ? "rbt-fancy-text" : ""} rbt-text-color-${color}`}
            >
              {item.text}
            </span>
            {item.href ? (
              <Link
                className={` ml--8 rbt-fancy-text rbt-fancy-link ${hasFancyText ? "rbt-fancy-text" : ""} rbt-text-color-${color}`}
                href={item.href}
              >
                {announcementLinkLabel(item.href)}
              </Link>
            ) : null}
          </div>
        </SwiperSlide>
      ))}

      <div
        className={`rbt-vertical-arrow rbt-arrow-prev ${prevClass} rbt-text-color-${color}`}
      >
        <i className="fa-regular fa-chevron-up" />
      </div>
      <div
        className={`rbt-vertical-arrow rbt-arrow-next ${nextClass} rbt-text-color-${color}`}
      >
        <i className="fa-regular fa-chevron-down" />
      </div>
    </Swiper>
  );
}
