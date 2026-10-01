"use client";

import Tooltip from "@/components/common/ui/Tooltip";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Link from "next/link";
import { buildShopCatalogHref, createShopCatalogQuery } from "@/lib/shop-query";

const POPULAR_SEARCHES = [
  "Fashion",
  "Interior",
  "Nature",
  "Elementor",
  "Art",
  "Aliexpress",
  "Technology",
  "Texture",
  "Architecture",
  "Business",
  "Elementor",
  "Aliexpress",
];

type StorefrontSearchPanelDemoExtrasProps = {
  copyLinkInputId: string;
  onDismissMedia?: () => void;
  showMediaDismissOutsider?: boolean;
};

export default function StorefrontSearchPanelDemoExtras({
  copyLinkInputId,
  onDismissMedia,
  showMediaDismissOutsider = false,
}: StorefrontSearchPanelDemoExtrasProps) {
  const { registerInputRef, getTooltip, copyFromRef, isCopied } =
    useCopyToClipboard({ defaultTooltip: "Copy" });

  return (
    <>
      <div className="rbt-search-form">
        <div className="rbt-media-search-section">
          <div className="rbt-media-wrapper">
            <div className="section-title">
              <span className="title b1">
                Find product inspiration with Image Search
              </span>
            </div>
            <div className="rbt-file-upload-container">
              <input type="file" className="fileInput" multiple hidden />
              <div className="file-upload-area fileUploadArea">
                <div className="file-upload-content">
                  <span className="rbt-icon">
                    <i
                      className="fa-solid fa-cloud-arrow-up"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="rbt-title">
                    Drag &amp; Drop Files Here{" "}
                    <span className="rbt-text-color-gray-400">Or</span>
                  </p>
                  <button
                    type="button"
                    className="browseFilesButton rbt-btn rbt-btn-sm"
                  >
                    Browse Files
                  </button>
                </div>
                <div className="fileList file-list" />
              </div>
              <p className="fileCount">0 of 10</p>
            </div>
            <div className="rbt-copy-link-part rbt-text-copy-activation">
              <input
                ref={registerInputRef(copyLinkInputId)}
                className="rbt-copy-value-field"
                type="text"
                defaultValue="https://beauty-station.template/wishlist"
                readOnly
              />
              <Tooltip
                content={getTooltip(copyLinkInputId)}
                placement="top"
                forceOpen={isCopied(copyLinkInputId)}
              >
                <button
                  type="button"
                  className="rbt-btn rbt-btn-xs has-left-icon rbt-copy-btn"
                  onClick={(event) => {
                    event.preventDefault();
                    void copyFromRef(copyLinkInputId);
                  }}
                >
                  <i className="fa-regular fa-copy" aria-hidden="true" />
                  <span className="rbt-btn-text">Copy</span>
                </button>
              </Tooltip>
            </div>
            <button
              type="button"
              className="rbt-round-btn rbt-ms-dismiss-btn"
              aria-label="Close image search panel"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
        {showMediaDismissOutsider ? (
          <button
            type="button"
            className="rbt-ms-dismiss-outsider"
            aria-label="Close search dropdown"
            onClick={onDismissMedia}
          />
        ) : null}
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="border-0 p-0 text-left title-sm-fsize">
            <h6 className="title">
              <span className="rbt-bold--text">Popular searches</span>
            </h6>
          </div>
        </div>
        <div className="rbt-search-list-wrapper rbt-tag-list rbt-tag-list-rounded-lg">
          {POPULAR_SEARCHES.map((keyword, index) => (
            <Link
              key={`${keyword}-${index}`}
              href={buildShopCatalogHref(
                createShopCatalogQuery({ page: 1, search: keyword })
              )}
            >
              {keyword}
            </Link>
          ))}
        </div>
      </div>
      <div className="rbt-separator-mid ptb_sm--12 ptb--24">
        <hr className="rbt-separator m-0" />
      </div>
    </>
  );
}

export type StorefrontSearchPanelVariant = "demo" | "production";
