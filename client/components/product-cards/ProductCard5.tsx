import OfferBadge from "@/components/common/ui/OfferBadge";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "@/components/common/ui/Tooltip";
import { getProductReviewCount } from "@/lib/mappers/product";
import { Product } from "@/types";
import AddToQuickViewOne from "../action-buttons/AddToQuickViewOne";
import AddToWishlistTwo from "../action-buttons/AddToWishlistTwo";
import { PRODUCT_CARD_SQUARE_IMAGE } from "@/lib/product-card-image";
import ProductCardImageBadges from "./ProductCardImageBadges";

export default function ProductCard5({
  product,
  detailsPageUrl = "/product-single-default",
  imbBgClass = "",
  contentBgClass = "",
  starClass = "",
  animationOrder = 1,
}: {
  product: Product;
  detailsPageUrl?: string;
  imbBgClass?: string;
  contentBgClass?: string;
  starClass?: string;
  animationOrder?: number;
}) {
  const detailsPageLink = `${detailsPageUrl}/${product.id}`;
  const reviewCount = getProductReviewCount(product);
  const displayRating =
    reviewCount > 0
      ? Math.min(5, Math.max(0, Math.round(product.rating ?? 0)))
      : 0;

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <li key={i}>
          <i
            className={`fa-solid fa-star${i < rating ? " rbt-rated-icon" : ""}`}
          />
        </li>
      );
    }
    return stars;
  };

  return (
    <div
      className={`rbt-card rbt-product-card rbt-scroll-trigger fade_in animation-order-${animationOrder}`}
    >
      <div
        className={`rbt-card-img rbt-card-img-aspect-square top-rounded-md rbt-scroll-trigger ${
          product.hoverImg ? "rbt-has-hover-img" : ""
        } ${imbBgClass} zoom_in animation-order-${animationOrder}`}
      >
        <Link href={detailsPageLink}>
          <Image
            alt="Card Image"
            className="rbt-prd-img"
            quality={PRODUCT_CARD_SQUARE_IMAGE.quality}
            sizes={PRODUCT_CARD_SQUARE_IMAGE.sizes}
            src={product.imgSrc}
            width={PRODUCT_CARD_SQUARE_IMAGE.width}
            height={PRODUCT_CARD_SQUARE_IMAGE.height}
          />

          {product.hoverImg && (
            <Image
              alt="Card Image"
              className="rbt-hover-img"
              quality={PRODUCT_CARD_SQUARE_IMAGE.quality}
              sizes={PRODUCT_CARD_SQUARE_IMAGE.sizes}
              src={product.hoverImg}
              width={PRODUCT_CARD_SQUARE_IMAGE.width}
              height={PRODUCT_CARD_SQUARE_IMAGE.height}
            />
          )}
        </Link>
        <ProductCardImageBadges
          badge={product.badge}
          badges={product.badges}
          layout="singleAbsolute"
        />
        <div className="rbt-quick-btn-grp has-mixup-midlayer rbt-top-right--position hover-variation-one">
          <AddToWishlistTwo
            parentClass="rbt-wishlist-btn bg-light-one rbt-quick-btn tooltips"
            product={product}
          />
          <Tooltip content="Quick View" placement="left">
            <AddToQuickViewOne
              product={product}
              className="rbt-watch-btn bg-light-one rbt-quick-btn tooltips"
              type="button"
              openModalName="quickViewModal"
            >
              <i className="fa-sharp fa-regular fa-magnifying-glass" />
            </AddToQuickViewOne>
          </Tooltip>
        </div>

        <AddToQuickViewOne
          product={product}
          className="rbt-btn hover-appear-element bottom-position text-center rbt-btn-sm rbt-square-btn d-block has-left-icon"
          openModalName="quickViewModal"
        >
          Select Option
        </AddToQuickViewOne>
      </div>
      <div
        className={`rbt-card-body rbt-card-body-center-align ${contentBgClass}`}
      >
        {product.category?.length && product.category.length > 0 && (
          <div>
            {product.category?.map((item, index) => (
              <Link
                key={index}
                href={`/shop-by-categories`}
                className="rbt-card-subtitle rbt-card-categories-text"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
        <h6 className="rbt-card-title">
          <Link href={detailsPageLink}>{product.title}</Link>
        </h6>
        {reviewCount > 0 ? (
          <div className="rbt-card-rating">
            <ul className={`rbt-rating-icon-list ${starClass}`.trim()}>
              {renderRatingStars(displayRating)}
            </ul>
            <p className="rating-digit">({reviewCount})</p>
            <span className="icon">
              <i className="fa-sharp fa-solid fa-truck-fast" />
            </span>
          </div>
        ) : null}
        <div className="pricing-part">
          {product.oldPrice && (
            <del className="price-text">${product.oldPrice.toFixed(2)}</del>
          )}
          <span className="price-text">${product.price.toFixed(2)}</span>
          <OfferBadge product={product} variant="minus" />
        </div>
      </div>
    </div>
  );
}
