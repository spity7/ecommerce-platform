"use client";

import OfferBadge from "@/components/common/ui/OfferBadge";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import Tooltip from "@/components/common/ui/Tooltip";
import { useWishlistCartActions } from "@/hooks/useWishlistCartActions";
import { formatCurrency } from "@/lib/price";
import { getWishlistProductPath } from "@/lib/wishlist-sync";
import type { Product, ProductBadge } from "@/types";

const FALLBACK_IMAGE = "/assets/images/wishlist/wishlist-prd-1.webp";

type WishlistProductTableProps = {
  browseHref?: string;
  browseLabel?: string;
  emptyHint?: string;
  emptyLayout?: "compact" | "featured";
  emptyTitle?: string;
  removeIcon?: "close" | "heart";
  showEmptyBrowseButton?: boolean;
  showStock?: boolean;
  tableClassName?: string;
  wrapperClassName?: string;
};

const DEFAULT_EMPTY_HINT =
  "Nothing saved yet. Tap the heart on a product to add it here.";

const DEFAULT_EMPTY_TITLE = "Nothing saved yet";

export default function WishlistProductTable({
  browseHref = "/shop",
  browseLabel = "Browse Products",
  emptyHint = DEFAULT_EMPTY_HINT,
  emptyLayout = "compact",
  emptyTitle = DEFAULT_EMPTY_TITLE,
  removeIcon = "close",
  showEmptyBrowseButton = true,
  showStock = true,
  tableClassName = "rbt-transparent-table-one rbt-wishlist-table mb--0",
  wrapperClassName = "rbt-transparent-table-one-wrapper pt--0 pb--0 mb--0",
}: WishlistProductTableProps) {
  const { wishList, removeFromWishlist } = useContextElement();
  const { handleAddToCart, isAddedToCartProducts, mounted } =
    useWishlistCartActions();

  if (mounted && wishList.length === 0) {
    if (emptyLayout === "featured") {
      return (
        <div
          className={`rbt-wishlist-page-empty rbt-has-bg-gray ${wrapperClassName}`.trim()}
        >
          <div aria-hidden="true" className="rbt-wishlist-page-empty__icon">
            <i className="fa-sharp fa-regular fa-heart" />
          </div>
          <h3 className="rbt-title rbt-text-bold mb--8">{emptyTitle}</h3>
          <p className="b2 mb--0 rbt-text-color-gray-500 rbt-wishlist-page-empty__hint">
            {emptyHint}
          </p>
          {showEmptyBrowseButton ? (
            <Link
              href={browseHref}
              className="rbt-btn rbt-btn-md rbt-btn-primary mt--24"
            >
              {browseLabel}
            </Link>
          ) : null}
        </div>
      );
    }

    return (
      <div className={`${wrapperClassName} text-center py-5 px-3`}>
        <p className="b3 mb--0 rbt-text-color-gray-500 mx-auto rbt-wishlist-empty-hint">
          {emptyHint}
        </p>
        {showEmptyBrowseButton ? (
          <Link
            href={browseHref}
            className="rbt-btn rbt-btn-md rbt-btn-primary mt--16"
          >
            {browseLabel}
          </Link>
        ) : null}
      </div>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>
        <tbody>
          {wishList.map((product) => (
            <WishlistProductRow
              key={product.id}
              product={product}
              removeIcon={removeIcon}
              showStock={showStock}
              inCart={isAddedToCartProducts(product.id)}
              onRemove={() => removeFromWishlist(product.id)}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type WishlistProductRowProps = {
  product: Product;
  removeIcon: "close" | "heart";
  showStock: boolean;
  inCart: boolean;
  onRemove: () => void;
  onAddToCart: () => void;
};

function WishlistProductRow({
  product,
  removeIcon,
  showStock,
  inCart,
  onRemove,
  onAddToCart,
}: WishlistProductRowProps) {
  const productPath = getWishlistProductPath(product);
  const inStock = product.inStock !== false;

  return (
    <tr>
      <td className="rbt-product-remove-btn-wrapper rbt-wishlist-remove-col">
        <WishlistRemoveButton removeIcon={removeIcon} onRemove={onRemove} />
      </td>
      <td className="product-thumbnail rbt-wishlist-product-media">
        <div className="rbt-wishlist-product-thumb-wrap">
          <div className="rbt-wishlist-thumb-remove rbt-wishlist-thumb-remove--overlay">
            <WishlistRemoveButton removeIcon={removeIcon} onRemove={onRemove} />
          </div>
          <Link href={productPath}>
            <Image
              alt={product.title || "Product image"}
              src={product.imgSrc || FALLBACK_IMAGE}
              width={278}
              height={212}
            />
          </Link>
        </div>
      </td>
      <td className="rbt-wish-product-info">
        <h6 className="rbt-wish-product-name">
          <Link href={productPath}>{product.title}</Link>
        </h6>
        <div className="pricing-part rbt-wishlist-row-pricing">
          {product.oldPrice != null && product.oldPrice > product.price ? (
            <del className="price-text">{formatCurrency(product.oldPrice)}</del>
          ) : null}
          <span className="price-text rbt-text-color-primary">
            {formatCurrency(product.price)}
          </span>
          <OfferBadge product={product} variant="minus" />
        </div>
        {product.sku?.trim() ? (
          <span className="rbt-product-id">
            <span className="rbt-text-semi-bold">SKU:</span>{" "}
            {product.sku.trim()}
          </span>
        ) : null}
      </td>
      {showStock ? (
        <td className="rbt-product-stock-status">
          <WishlistRowBadges inStock={inStock} product={product} />
        </td>
      ) : null}
      <td>
        <div className="rbt-button-group">
          <button
            type="button"
            className="rbt-btn rbt-btn-sm has-left-icon"
            onClick={onAddToCart}
            disabled={inCart || !inStock}
          >
            <i
              className={
                inCart
                  ? "fa-regular fa-check mr--4"
                  : "fa-regular fa-cart-plus mr--4"
              }
            />
            {inCart ? "In Cart" : "Add To Cart"}
          </button>
        </div>
      </td>
    </tr>
  );
}

function WishlistRemoveButton({
  removeIcon,
  onRemove,
}: {
  removeIcon: "close" | "heart";
  onRemove: () => void;
}) {
  return (
    <Tooltip
      content={removeIcon === "heart" ? "Remove from wishlist" : "Remove"}
      placement="top"
    >
      <button
        className={`rbt-product-remove-btn rbt-round-btn tooltips${
          removeIcon === "heart" ? " rbt-wishlist-unsave-btn" : ""
        }`}
        type="button"
        onClick={onRemove}
      >
        <span>
          <i
            className={
              removeIcon === "heart" ? "fa-solid fa-heart" : "fa-solid fa-xmark"
            }
          />
        </span>
      </button>
    </Tooltip>
  );
}

function WishlistRowBadges({
  inStock,
  product,
}: {
  inStock: boolean;
  product: Product;
}) {
  const badges = product.badges?.filter((badge) => badge.text?.trim()) ?? [];

  if (badges.length > 0) {
    return (
      <div className="rbt-wishlist-row-badges">
        {badges.map((badge, index) => (
          <WishlistBadge
            key={`${badge.kind ?? badge.text}-${index}`}
            badge={badge}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`rbt-product-badge border-rounded${
        inStock
          ? " rbt-product-badge-bg-light-green"
          : " rbt-product-badge-bg-light-red"
      }`}
    >
      {inStock ? "IN STOCK" : "OUT OF STOCK"}
    </div>
  );
}

function WishlistBadge({ badge }: { badge: ProductBadge }) {
  return (
    <div
      className={`rbt-product-badge border-rounded${
        badge.bg ? ` ${badge.bg}` : ""
      }`}
    >
      {badge.text}
    </div>
  );
}
