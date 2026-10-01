"use client";

import { type ReactNode } from "react";
import { useContextElement } from "@/context/Context";
import WishlistProductTable from "@/components/store/WishlistProductTable";
import WishlistSectionSkeleton from "@/components/store/WishlistSectionSkeleton";

const FEATURED_EMPTY_PROPS = {
  browseLabel: "Browse the shop",
  emptyHint:
    "Tap the heart on a product to add it here. When you're signed in, your list stays in sync across devices.",
  emptyLayout: "featured" as const,
  emptyTitle: "Your wishlist is empty",
};

function WishlistPageHeader() {
  return (
    <div className="rbt-component-section-title rbt-gap--4 mb--24 p-0 border-0 text-center">
      <h2 className="rbt-title mb--8 rbt-wishlist-page-title">
        <span aria-hidden="true" className="rbt-wishlist-page-title__icon">
          <i className="fa-sharp fa-solid fa-heart" />
        </span>
        <span className="rbt-text-bold">Wishlist</span>
      </h2>
      <p className="description mx-auto mb--0">
        Your saved products—add to cart or remove anytime.
      </p>
    </div>
  );
}

function WishlistPanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="rbt-profile-content-area rbt-scrollable-content rbt-wishlist-page">
      <WishlistPageHeader />
      {children}
    </div>
  );
}

export default function Wishlist() {
  const { mounted, wishList } = useContextElement();
  const isEmpty = mounted && wishList.length === 0;

  if (!mounted) {
    return (
      <div className="rbt-profile-content-area rbt-scrollable-content">
        <WishlistSectionSkeleton />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <WishlistPanelShell>
        <WishlistProductTable {...FEATURED_EMPTY_PROPS} />
      </WishlistPanelShell>
    );
  }

  return (
    <WishlistPanelShell>
      <WishlistProductTable removeIcon="heart" />
    </WishlistPanelShell>
  );
}
