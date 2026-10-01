"use client";

import { useEffect, useState } from "react";
import { fetchWishlist } from "@platform/api-client";
import { getStorefrontSiteConfig } from "@/lib/site";
import {
  isServerWishlistEnabled,
  mapWishlistDtoToProducts,
} from "@/lib/wishlist-sync";
import { applyServerWishlistToStoreWhenIdle } from "@/context/store";
import Wishlist from "./Wishlist";
import WishlistSectionSkeleton from "@/components/store/WishlistSectionSkeleton";

export default function WishlistPanel() {
  const site = getStorefrontSiteConfig();
  const serverWishlistEnabled = isServerWishlistEnabled();
  const [loading, setLoading] = useState(serverWishlistEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serverWishlistEnabled) {
      return;
    }

    let cancelled = false;

    void fetchWishlist()
      .then((wishlist) => {
        if (cancelled) {
          return;
        }

        applyServerWishlistToStoreWhenIdle(mapWishlistDtoToProducts(wishlist));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load wishlist.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [serverWishlistEnabled]);

  if (!site.features.wishlist) {
    return (
      <p className="mb--0">Wishlist is not enabled for this storefront.</p>
    );
  }

  if (!serverWishlistEnabled) {
    return <Wishlist />;
  }

  if (loading) {
    return (
      <div className="rbt-profile-content-area rbt-scrollable-content">
        <WishlistSectionSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="rbt-text-color-danger mb--0">{error}</p>;
  }

  return <Wishlist />;
}
