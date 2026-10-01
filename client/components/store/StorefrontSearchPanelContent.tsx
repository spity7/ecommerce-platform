"use client";

import StorefrontProductSearchForm from "@/components/store/StorefrontProductSearchForm";
import StorefrontSearchPanelDemoExtras, {
  type StorefrontSearchPanelVariant,
} from "@/components/store/StorefrontSearchPanelDemoExtras";
import StorefrontSearchTrendingProducts from "@/components/store/StorefrontSearchTrendingProducts";
import { getStorefrontSiteConfig } from "@/lib/site";

export type { StorefrontSearchPanelVariant } from "@/components/store/StorefrontSearchPanelDemoExtras";

type StorefrontSearchPanelContentProps = {
  copyLinkInputId: string;
  onSearchSubmitted?: () => void;
  separatorClassName?: string;
  showMediaDismissOutsider?: boolean;
  titleClassName?: string;
  variant?: StorefrontSearchPanelVariant;
};

export default function StorefrontSearchPanelContent({
  copyLinkInputId,
  onSearchSubmitted,
  separatorClassName = "ptb_sm--12 ptb--24",
  showMediaDismissOutsider = false,
  titleClassName = "text-center",
  variant = "demo",
}: StorefrontSearchPanelContentProps) {
  const siteName =
    variant === "production" ? getStorefrontSiteConfig().name : undefined;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="rbt-component-section-title border-0 p-0 text-center">
            <h4 className={`rbt-title ${titleClassName}`.trim()}>
              <span className="rbt-bold--text">
                {siteName ? `Search ${siteName}` : "Search For Products"}
              </span>
            </h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <StorefrontProductSearchForm
            scrollOnShopSearch
            onSubmitted={onSearchSubmitted}
          />
          {variant === "demo" ? (
            <StorefrontSearchPanelDemoExtras
              copyLinkInputId={copyLinkInputId}
              onDismissMedia={
                showMediaDismissOutsider ? onSearchSubmitted : undefined
              }
              showMediaDismissOutsider={showMediaDismissOutsider}
            />
          ) : (
            <div className={`rbt-separator-mid ${separatorClassName}`.trim()}>
              <hr className="rbt-separator m-0" />
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="border-0 p-0 text-left title-sm-fsize">
            <h6 className="title">
              <span className="rbt-bold--text">Trending Products</span>
            </h6>
          </div>
        </div>
      </div>
      <StorefrontSearchTrendingProducts />
    </>
  );
}
