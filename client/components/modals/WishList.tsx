"use client";

import { CloseIcon } from "../svg-icons";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useManagedModalPanel } from "@/hooks/useManagedModalPanel";
import WishlistProductTable from "@/components/store/WishlistProductTable";
import { CustomerAccountLink } from "@/components/auth/customer-account-link";
import { WISHLIST_PAGE_PATH } from "@/lib/wishlist-paths";
import { STOREFRONT_WISHLIST_PAGE_ADMIN_HINT } from "@/lib/storefront-customer-access";

export default function WishList() {
  const { close } = useManagedModalPanel("wishlistModal");
  const { mounted, wishList } = useContextElement();
  const isEmpty = mounted && wishList.length === 0;
  const savedCount = wishList.length;

  return (
    <div
      className="rbt-default-modal modal fade has-rbt-top-folder-shape rbt-wishlist-modal"
      id="wishlistModal"
      tabIndex={-1}
      aria-labelledby="wishlistModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog sm-size modal-dialog-centered">
        <div className="modal-content">
          <div className="rbt-folder-shape-right-portion">
            <CloseIcon />
          </div>
          <div className="modal-header">
            <button
              type="button"
              className="rbt-round-btn rbt-modal-dis-btn"
              aria-label="Close"
              onClick={close}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="rbt-top-folder-shape-wrapper">
            <div className="rbt-bg-color-white rbt-content-trs-portion">
              <div className="rbt-wishlist-modal-content">
                <div className="rbt-wishlist-modal-header">
                  <h4
                    className="rbt-wishlist-modal-title rbt-title rbt-text-bold mb--8"
                    id="wishlistModalLabel"
                  >
                    <span
                      aria-hidden="true"
                      className="rbt-wishlist-modal-title__icon"
                    >
                      <i className="fa-sharp fa-solid fa-heart" />
                    </span>
                    Product Wishlist
                  </h4>
                  <p className="b3 mb--0 rbt-text-color-gray-500">
                    {mounted && savedCount > 0
                      ? `${savedCount} saved item${savedCount === 1 ? "" : "s"}`
                      : "Save favorites from the shop or any product page."}
                  </p>
                </div>

                <div className="rbt-wishlist-modal-body">
                  {!mounted ? (
                    <p className="b3 mb--0 rbt-text-color-gray-400 text-center py-5">
                      Loading your wishlist…
                    </p>
                  ) : isEmpty ? (
                    <div className="rbt-wishlist-modal-empty rbt-has-bg-gray">
                      <div
                        aria-hidden="true"
                        className="rbt-wishlist-modal-empty__icon"
                      >
                        <i className="fa-sharp fa-regular fa-heart" />
                      </div>
                      <h6 className="rbt-title mb--8">Nothing saved yet</h6>
                      <p className="b3 mb--0 rbt-text-color-gray-500 rbt-wishlist-empty-hint">
                        Tap the heart on a product to keep it here. Your list
                        syncs when you&apos;re signed in.
                      </p>
                    </div>
                  ) : (
                    <WishlistProductTable
                      showStock={false}
                      wrapperClassName="rbt-transparent-table-one-wrapper rbt-has-bg-gray pt--0 pb--0 mb--0"
                      tableClassName="rbt-transparent-table-one mb--0 rbt-wishlist-table"
                    />
                  )}
                </div>

                <div className="rbt-wishlist-modal-footer d-flex flex-column flex-sm-row rbt-gap--12">
                  <CustomerAccountLink
                    className="rbt-btn rbt-btn-md rbt-btn-border has-left-icon flex-fill text-center"
                    disabledHint={STOREFRONT_WISHLIST_PAGE_ADMIN_HINT}
                    href={WISHLIST_PAGE_PATH}
                    onClick={close}
                    tooltipPlacement="top"
                  >
                    <i className="fa-sharp fa-regular fa-heart mr--4" />
                    View full wishlist
                  </CustomerAccountLink>
                  <Link
                    className="rbt-btn rbt-btn-md rbt-btn-primary flex-fill text-center"
                    href="/shop"
                    onClick={close}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
