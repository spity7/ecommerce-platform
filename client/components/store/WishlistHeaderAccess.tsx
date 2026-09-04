"use client";

import ModalTriggerButton from "@/components/action-buttons/ModalTriggerButton";
import Tooltip from "@/components/common/ui/Tooltip";
import WishlistLength from "@/components/store/WishlistLength";

type WishlistHeaderAccessProps = {
  className?: string;
  tooltipPlacement?: "top" | "right" | "bottom" | "left";
};

const DEFAULT_CLASS =
  "rbt-round-btn has-rbt-md-fsize tooltips tooltip-distance-lg";

export default function WishlistHeaderAccess({
  className = DEFAULT_CLASS,
  tooltipPlacement = "bottom",
}: WishlistHeaderAccessProps) {
  return (
    <Tooltip content="Wishlist" placement={tooltipPlacement}>
      <ModalTriggerButton
        as="div"
        className={className}
        openModalName="wishlistModal"
      >
        <i className="fa-regular fa-heart" />
        <div className="access-box-count">
          <WishlistLength />
        </div>
      </ModalTriggerButton>
    </Tooltip>
  );
}
