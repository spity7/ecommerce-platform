"use client";

import Link from "next/link";
import Tooltip from "@/components/common/ui/Tooltip";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { usePathname } from "next/navigation";
import WishlistProductTable from "@/components/store/WishlistProductTable";

export default function Wishlist() {
  const { copied, copy } = useCopyToClipboard();
  const pathname = usePathname();
  const currentUrl =
    typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";

  return (
    <div className="rbt-profile-content-area rbt-scrollable-content">
      <div className="rbt-component-section-title rbt-gap--4 mb--24 p-0 border-0 text-center">
        <h2 className="rbt-title mb--8">
          <span className="rbt-text-bold">Wishlist</span>
        </h2>
        <p className="description mx-auto">
          Explore and manage your favorite products in one place. Add items to
          your cart or share your wishlist with friends and family.
        </p>
      </div>
      <WishlistProductTable />
      <hr className="mb--24" />
      <div className="rbt-wishlist-bottom-area">
        <div className="rbt-social-share-area">
          <p className="title mb--0 mr--24 mr_sm--0">Share on :</p>
          <ul className="rbt-social-icon-list mt_md--0 mt_sm--0">
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-twitter" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-youtube" />
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook" />
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram" />
              </a>
            </li>
            <li>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-telegram" />
              </a>
            </li>
          </ul>
        </div>
        <div className="rbt-copy-link-part rbt-text-copy-activation">
          <span className="rbt-copy-link-title">Wishlist link:</span>
          <input
            className="rbt-copy-value-field"
            type="text"
            value={currentUrl}
            readOnly={true}
          />
          <Tooltip content="Copy to clipboard" placement="top">
            <button
              className="rbt-btn rbt-btn-xs has-left-icon rbt-copy-btn"
              onClick={() => copy(currentUrl)}
              type="button"
            >
              <i className="fa-regular fa-copy" />
              <span className="rbt-btn-text ml--4">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
