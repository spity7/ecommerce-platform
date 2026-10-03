import { ModalName } from "@/types/modal";
import {
  isStorefrontWishlistEnabled,
  type StorefrontNavVariant,
} from "@/lib/storefront-nav";

export type { ToolbarItem } from "@/types/misc";

export const toolbarItems = [
  {
    id: "compare",
    label: "Compare",
    icon: "fa-regular fa-code-compare",
    modalTarget: ModalName.compareReviewModal,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: "fa-regular fa-heart",
    modalTarget: ModalName.wishlistModal,
    hasCount: true,
  },
  {
    id: "search",
    label: "Search",
    icon: "fa-regular fa-search",
    isSearchTrigger: true,
  },
  {
    id: "shop",
    label: "Shop",
    icon: "fa-regular fa-bag-shopping",
    href: "/shop",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "fa-regular fa-user",
    modalTarget: ModalName.signinModal,
  },
];

export function getToolbarItemsForNavVariant(
  variant: StorefrontNavVariant
): typeof toolbarItems {
  return toolbarItems.filter((item) => {
    if (variant === "production" && item.id === "compare") {
      return false;
    }
    if (item.id === "wishlist" && !isStorefrontWishlistEnabled()) {
      return false;
    }
    return true;
  });
}
