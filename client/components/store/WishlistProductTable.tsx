"use client";

import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import Tooltip from "@/components/common/ui/Tooltip";
import { useWishlistCartActions } from "@/hooks/useWishlistCartActions";
import { getWishlistProductPath } from "@/lib/wishlist-sync";
import type { Product } from "@/types";

const FALLBACK_IMAGE =
  "/assets/images/wishlist/wishlist-prd-1.webp";

type WishlistProductTableProps = {
  showStock?: boolean;
  tableClassName?: string;
  wrapperClassName?: string;
  browseHref?: string;
};

export default function WishlistProductTable({
  showStock = true,
  tableClassName = "rbt-transparent-table-one rbt-wishlist-table mb--0",
  wrapperClassName = "rbt-transparent-table-one-wrapper pt--0 pb--0 mb--0",
  browseHref = "/shop",
}: WishlistProductTableProps) {
  const { wishList, removeFromWishlist } = useContextElement();
  const { handleAddToCart, isAddedToCartProducts, mounted } =
    useWishlistCartActions();

  if (mounted && wishList.length === 0) {
    return (
      <div className={`${wrapperClassName} text-center py-5`}>
        <p className="rbt-text-color-gray-600 mb--0">
          Your wishlist is empty.
        </p>
        <Link
          href={browseHref}
          className="rbt-btn rbt-btn-md rbt-btn-primary mt--16"
        >
          Browse Products
        </Link>
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
  showStock: boolean;
  inCart: boolean;
  onRemove: () => void;
  onAddToCart: () => void;
};

function WishlistProductRow({
  product,
  showStock,
  inCart,
  onRemove,
  onAddToCart,
}: WishlistProductRowProps) {
  const productPath = getWishlistProductPath(product);
  const inStock = product.inStock !== false;

  return (
    <tr>
      <td className="rbt-product-remove-btn-wrapper">
        <Tooltip content="Remove" placement="top">
          <button
            className="rbt-product-remove-btn rbt-round-btn tooltips"
            type="button"
            onClick={onRemove}
          >
            <span>
              <i className="fa-solid fa-xmark" />
            </span>
          </button>
        </Tooltip>
      </td>
      <td className="product-thumbnail">
        <Link href={productPath}>
          <Image
            alt={product.title || "Product image"}
            src={product.imgSrc || FALLBACK_IMAGE}
            width={278}
            height={212}
          />
        </Link>
      </td>
      <td className="rbt-wish-product-info">
        <h6 className="rbt-wish-product-name">
          <Link href={productPath}>{product.title}</Link>
        </h6>
        <div className="rbt-product-price-text rbt-text-color-primary">
          <span>${product.price.toFixed(2)}</span>
        </div>
        <span className="rbt-product-id">
          <span className="rbt-text-semi-bold">SKU:</span>#
          {product.apiProductId ?? product.id}
        </span>
      </td>
      {showStock ? (
        <td className="rbt-product-stock-status">
          <div
            className={`rbt-product-badge rbt-product-badge-bg-light-green border-rounded${
              inStock ? "" : " rbt-product-badge-bg-light-red"
            }`}
          >
            {inStock ? "IN STOCK" : "OUT OF STOCK"}
          </div>
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
            <i className="fa-regular fa-cart-shopping mr--4" />
            {inCart ? "In Cart" : "Add To Cart"}
          </button>
        </div>
      </td>
    </tr>
  );
}
