"use client";

import { CloseIcon } from "../svg-icons";
import Link from "next/link";
import { useManagedModalPanel } from "@/hooks/useManagedModalPanel";
import WishlistProductTable from "@/components/store/WishlistProductTable";
import { WISHLIST_PAGE_PATH } from "@/lib/wishlist-paths";

export default function WishList() {
  const { close } = useManagedModalPanel("wishlistModal");

  return (
    <div
      className="rbt-default-modal modal fade has-rbt-top-folder-shape"
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
                <h5 className="rbt-title rbt-text-bold" id="wishlistModalLabel">
                  Product Wishlist
                </h5>
                <WishlistProductTable
                  showStock={false}
                  wrapperClassName="rbt-transparent-table-one-wrapper rbt-has-bg-gray pt--0 pb--0 mb--16"
                  tableClassName="rbt-transparent-table-one mb--0 rbt-wishlist-table"
                />
                <div className="rbt-wishlist-modal-footer d-flex flex-wrap rbt-gap--16 justify-content-between align-items-center">
                  <Link href={WISHLIST_PAGE_PATH} className="rbt-link">
                    <span className="icon mr--4">
                      <i className="fa-sharp fa-regular fa-heart" />
                    </span>
                    Open wishlist page
                  </Link>
                  <Link href="/shop" className="rbt-link">
                    Continue Shopping
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
