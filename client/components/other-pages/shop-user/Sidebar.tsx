"use client";

import { GiftIcon } from "../../svg-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getStorefrontSiteConfig } from "@/lib/site";
import { clearSession } from "@/lib/session";
import { useAuthSession } from "@/providers/auth-session-provider";

const primaryNavItems = [
  {
    href: "/my-order-history",
    iconClass: "fa-regular fa-cart-shopping-fast mr--4",
    label: "Orders",
    badge: "1",
  },
  {
    href: "/my-wishlist",
    iconClass: "fa-regular fa-heart mr--4",
    label: "Wishlist",
  },
  {
    href: "/my-payment-methods",
    iconClass: "fa-regular fa-money-bill mr--4",
    label: "Payment Methods",
  },
  {
    href: "/my-reviews",
    iconClass: "fa-regular fa-star-sharp-half-stroke mr--4",
    label: "My reviews",
  },
];

const manageAccountItems = [
  {
    href: "/account-info",
    iconClass: "fa-regular fa-user-vneck mr--4",
    label: "Personal info",
  },
  {
    href: "/account-notifications",
    iconClass: "fa-regular fa-cowbell mr--4",
    label: "Notifications",
  },
];

const customerServiceItems = [
  {
    href: "/help-center",
    iconClass: "fa-regular fa-circle-question mr--4",
    label: "Help",
  },
  {
    href: "/terms-policy",
    iconClass: "fa-regular fa-circle-info mr--4",
    label: "Terms and conditions",
  },
];

const DEFAULT_AVATAR = "/assets/images/dashboard/user-profile-01.webp";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const site = getStorefrontSiteConfig();
  const { user, loading } = useAuthSession();
  const customerAuth = site.features.customerAuth;

  async function handleLogout() {
    if (customerAuth) {
      await clearSession();
      window.dispatchEvent(new Event("auth:session-updated"));
    }
    router.push("/signin");
    router.refresh();
  }

  const displayName = customerAuth
    ? loading
      ? "Loading…"
      : (user?.name ?? "Guest")
    : "Johnson Charle";

  const avatarSrc =
    customerAuth && user?.avatarUrl ? user.avatarUrl : DEFAULT_AVATAR;

  return (
    <aside className="rbt-profile-sidebar sticky-top">
      <div className="rbt-user-profile">
        <figure className="rbt-user-profile-img">
          <Image
            alt="Profile Image"
            src={avatarSrc}
            width={96}
            height={96}
            unoptimized={Boolean(customerAuth && user?.avatarUrl)}
          />
        </figure>
        <div className="pl--12">
          <h5 className="h6 mb-1">{displayName}</h5>
          {!customerAuth ? (
            <div className="nav flex-nowrap text-nowrap min-w-0">
              <span className="rbt-link-hover rbt-cursor-pointer d-flex align-items-center rbt-gap--4">
                <GiftIcon />
                <a href="#">100 bonuses</a>
                <span>available</span>
              </span>
            </div>
          ) : user?.email ? (
            <p className="mb--0 b3 text-truncate">{user.email}</p>
          ) : null}
        </div>
      </div>
      <hr className="mb--8 mt--20" />
      <div className="rbt-sidebar-widgets">
        <div className="rbt-sidebar-single-widget">
          <nav className="rbt-sidebar-nav-list list-group">
            {primaryNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span>
                  <i className={item.iconClass} />
                  {item.label}
                </span>
                {!customerAuth && item.badge ? (
                  <span className="badge bg-primary rounded-pill ms-auto">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
        <div className="rbt-sidebar-single-widget">
          <h6 className="rbt-title">Manage account</h6>
          <nav className="rbt-sidebar-nav-list list-group">
            {manageAccountItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span>
                  <i className={item.iconClass} />
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="rbt-sidebar-single-widget">
          <h6 className="rbt-title">Customer service</h6>
          <nav className="rbt-sidebar-nav-list list-group">
            {customerServiceItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                <span>
                  <i className={item.iconClass} />
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <hr />
        <nav className="rbt-sidebar-nav-list list-group">
          <button
            className="border-0 bg-transparent p-0 text-start w-100"
            onClick={() => void handleLogout()}
            type="button"
          >
            <span>
              <i className="fa-regular fa-right-from-bracket mr--4" />
              Log out
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
