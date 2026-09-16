"use client";

import { type ReactNode } from "react";
import { UserProfileAvatar } from "@/components/common/UserProfileAvatar";
import { GiftIcon } from "../../svg-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { canManageOwnReviews } from "@/lib/reviews-feature";
import { getStorefrontSiteConfig } from "@/lib/site";
import { clearSession } from "@/lib/session";
import { useAuthSession } from "@/providers/auth-session-provider";
import { useOptionalAccountInfoGuard } from "./AccountInfoGuard";

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
    customerReviewsOnly: true,
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

type SidebarNavLinkProps = {
  href: string;
  active: boolean;
  disabled: boolean;
  children: ReactNode;
};

function SidebarNavLink({
  href,
  active,
  disabled,
  children,
}: SidebarNavLinkProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${active ? "active" : ""} opacity-50 pe-none`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={active ? "active" : ""}>
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const site = getStorefrontSiteConfig();
  const { user, loading } = useAuthSession();
  const { actionsDisabled } = useOptionalAccountInfoGuard();
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

  const profileAvatarUrl = customerAuth ? user?.avatarUrl : undefined;

  const visiblePrimaryNavItems = primaryNavItems.filter((item) => {
    if ("customerReviewsOnly" in item && item.customerReviewsOnly) {
      return canManageOwnReviews(user);
    }
    return true;
  });

  return (
    <aside className="rbt-profile-sidebar sticky-top">
      <div className="rbt-user-profile">
        <figure className="rbt-user-profile-img">
          <UserProfileAvatar
            alt={displayName}
            avatarUrl={profileAvatarUrl}
            imageClassName="h-100 w-100 object-fit-cover"
            size={96}
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
            {visiblePrimaryNavItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                active={pathname === item.href}
                disabled={actionsDisabled}
                href={item.href}
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
              </SidebarNavLink>
            ))}
          </nav>
        </div>
        <div className="rbt-sidebar-single-widget">
          <h6 className="rbt-title">Manage account</h6>
          <nav className="rbt-sidebar-nav-list list-group">
            {manageAccountItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                active={pathname === item.href}
                disabled={actionsDisabled}
                href={item.href}
              >
                <span>
                  <i className={item.iconClass} />
                  {item.label}
                </span>
              </SidebarNavLink>
            ))}
          </nav>
        </div>
        <div className="rbt-sidebar-single-widget">
          <h6 className="rbt-title">Customer service</h6>
          <nav className="rbt-sidebar-nav-list list-group">
            {customerServiceItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                active={pathname === item.href}
                disabled={actionsDisabled}
                href={item.href}
              >
                <span>
                  <i className={item.iconClass} />
                  {item.label}
                </span>
              </SidebarNavLink>
            ))}
          </nav>
        </div>
        <hr />
        <nav className="rbt-sidebar-nav-list list-group">
          <button
            className="border-0 bg-transparent p-0 text-start w-100"
            disabled={actionsDisabled}
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
