"use client";
import type { Swiper as SwiperClass } from "swiper";
import Image from "next/image";

import { useEffect, useMemo, useRef, useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const DEFAULT_PRODUCT_IMAGES = [
  "/assets/images/product-img/beauty-product/beauty-product-a-03.webp",
  "/assets/images/product-img/beauty-product/beauty-product-a-04.webp",
  "/assets/images/product-img/beauty-product/beauty-product-a-01.webp",
  "/assets/images/product-img/beauty-product/beauty-product-a-02.webp",
];

import { getCatalogImageLightGalleryDownloadAttrs } from "@/lib/catalog-image-download";
import { usePdpThumbNavVisible } from "@/hooks/use-pdp-thumb-nav-visible";
import {
  PDP_GALLERY_SQUARE_IMAGE,
  PDP_GALLERY_THUMB_DESKTOP_MAX,
  PDP_GALLERY_THUMB_IMAGE,
  PDP_GALLERY_THUMB_LARGE_PHONE_MAX,
  PDP_GALLERY_THUMB_MOBILE_MAX,
  PDP_GALLERY_THUMB_TABLET_MAX,
} from "@/lib/product-card-image";
import "@/lib/lightgallery-styles";

type Slider3Props = {
  alt?: string;
  images?: string[];
};

function GalleryImage({
  alt,
  frameClassName,
  sizes = PDP_GALLERY_SQUARE_IMAGE.sizes,
  src,
}: {
  alt: string;
  frameClassName?: string;
  sizes?: string;
  src: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <span
      className={`rbt-pdp-gallery-frame${frameClassName ? ` ${frameClassName}` : ""}`}
    >
      <Image
        alt={alt}
        className="rbt-pdp-gallery-frame__img"
        fill
        onError={() => {
          setCurrentSrc(DEFAULT_PRODUCT_IMAGES[0]);
        }}
        quality={PDP_GALLERY_SQUARE_IMAGE.quality}
        sizes={sizes}
        src={currentSrc}
      />
    </span>
  );
}

function bindThumbNavigation(swiper: SwiperClass) {
  const navigation = swiper.params.navigation;
  if (!navigation || typeof navigation === "boolean") {
    return;
  }
  const prev = navigation.prevEl;
  const next = navigation.nextEl;
  if (!prev || !next) {
    return;
  }
  swiper.navigation.init();
  swiper.navigation.update();
}

function unbindThumbNavigation(swiper: SwiperClass) {
  if (swiper.navigation) {
    swiper.navigation.destroy();
  }
}

export default function Slider3({
  alt = "Product image",
  images,
}: Slider3Props) {
  const [swiperThumb, setSwiperThumb] = useState<SwiperClass | null>(null);
  const [activeMainIndex, setActiveMainIndex] = useState(0);
  const thumbPrevRef = useRef<HTMLButtonElement>(null);
  const thumbNextRef = useRef<HTMLButtonElement>(null);

  const syncActiveMainIndex = (swiper: SwiperClass) => {
    setActiveMainIndex(swiper.realIndex);
  };

  const productImages = useMemo(
    () => (images && images.length > 0 ? images : DEFAULT_PRODUCT_IMAGES),
    [images]
  );

  const imageCount = productImages.length;
  const showThumbNavigation = usePdpThumbNavVisible(imageCount);

  const thumbSwiperBreakpoints = useMemo(
    () => ({
      0: {
        direction: "horizontal" as const,
        slidesPerView: Math.min(imageCount, PDP_GALLERY_THUMB_MOBILE_MAX),
      },
      576: {
        direction: "horizontal" as const,
        slidesPerView: Math.min(imageCount, PDP_GALLERY_THUMB_LARGE_PHONE_MAX),
      },
      768: {
        direction: "horizontal" as const,
        slidesPerView: Math.min(imageCount, PDP_GALLERY_THUMB_TABLET_MAX),
      },
      992: {
        direction: "horizontal" as const,
        slidesPerView: Math.min(imageCount, PDP_GALLERY_THUMB_DESKTOP_MAX),
      },
    }),
    [imageCount]
  );

  useEffect(() => {
    if (!swiperThumb) {
      return;
    }
    if (!showThumbNavigation) {
      unbindThumbNavigation(swiperThumb);
      return;
    }
    const prevEl = thumbPrevRef.current;
    const nextEl = thumbNextRef.current;
    if (!prevEl || !nextEl) {
      return;
    }
    const navigation = swiperThumb.params.navigation;
    if (navigation && typeof navigation !== "boolean") {
      navigation.prevEl = prevEl;
      navigation.nextEl = nextEl;
    }
    bindThumbNavigation(swiperThumb);
  }, [swiperThumb, showThumbNavigation, imageCount]);

  return (
    <>
      <div className="rbt-medea-lg-img-area">
        <LightGallery
          elementClassNames="swiper rbt-arrow-between rbt-product-single-slider-twolayout-activation rbt-arrow-show-dfl"
          plugins={[lgThumbnail, lgZoom]}
          selector=".rbt-product-single-img"
          speed={400}
          zoomFromOrigin={false}
        >
          <Swiper
            className="swiper rbt-arrow-between rbt-product-single-slider-twolayout-activation rbt-arrow-show-dfl"
            {...{
              spaceBetween: 16,
              breakpoints: {
                575: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2 },
                1200: { slidesPerView: 2 },
              },
              navigation: {
                prevEl: ".rbt-arrow-left",
                nextEl: ".rbt-arrow-right",
              },
              thumbs: {
                swiper: swiperThumb,
              },
            }}
            modules={[Thumbs, Navigation]}
            onSlideChange={syncActiveMainIndex}
            onSwiper={syncActiveMainIndex}
          >
            <div className="swiper-wrapper rbt-store-thumb-main-1">
              {productImages.map((src, index) => (
                <SwiperSlide
                  className={`swiper-slide rbt-scroll-trigger fade_in animation-order-${
                    index + 1
                  }`}
                  key={`${src}-${index}`}
                >
                  <div className="thumbnail">
                    <a
                      className="rbt-product-single-img"
                      data-src={src}
                      href={src}
                      {...getCatalogImageLightGalleryDownloadAttrs(src)}
                    >
                      <GalleryImage
                        alt={alt}
                        frameClassName="rbt-rounded--12"
                        src={src}
                      />
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </div>
            <div className="rbt-swiper-arrow rbt-arrow-left">
              <div className="custom-overflow">
                <i className="rbt-icon fa-regular fa-arrow-left" />
                <i className="rbt-icon-top fa-regular fa-arrow-left" />
              </div>
            </div>
            <div className="rbt-swiper-arrow rbt-arrow-right">
              <div className="custom-overflow">
                <i className="rbt-icon fa-regular fa-arrow-right" />
                <i className="rbt-icon-top fa-regular fa-arrow-right" />
              </div>
            </div>
          </Swiper>
        </LightGallery>
      </div>
      <div
        className={`rbt-thumb-slide-part rbt-pdp-thumb-strip w-100${
          showThumbNavigation ? " rbt-pdp-thumb-strip--nav" : ""
        }${showThumbNavigation ? " rbt-pdp-thumb-scroll" : ""}`}
      >
        <div className="rbt-pdp-thumb-strip-inner">
          {showThumbNavigation ? (
            <button
              ref={thumbPrevRef}
              aria-label="Previous product image thumbnail"
              className="rbt-pdp-thumb-nav-btn"
              type="button"
            >
              <i aria-hidden className="fa-regular fa-arrow-left" />
            </button>
          ) : null}
          <Swiper
            className="swiper rbt-product-thumb-slider-twolayout-activation mt--24 mt_sm--12 mlr--0"
            {...{
              spaceBetween: 16,
              slidesPerView: Math.min(imageCount, PDP_GALLERY_THUMB_MOBILE_MAX),
              freeMode: showThumbNavigation,
              watchSlidesProgress: true,
              breakpoints: thumbSwiperBreakpoints,
              ...(showThumbNavigation
                ? {
                    navigation: {
                      prevEl: thumbPrevRef.current,
                      nextEl: thumbNextRef.current,
                    },
                  }
                : {}),
            }}
            modules={[Thumbs, FreeMode, Navigation]}
            onBeforeInit={(swiper) => {
              if (!showThumbNavigation) {
                return;
              }
              const navigation = swiper.params.navigation;
              if (navigation && typeof navigation !== "boolean") {
                navigation.prevEl = thumbPrevRef.current;
                navigation.nextEl = thumbNextRef.current;
              }
            }}
            onSwiper={setSwiperThumb}
          >
            <div className="swiper-wrapper rbt-store-thumb-variation-1">
              {productImages.map((src, index) => (
                <SwiperSlide
                  className={`swiper-slide rbt-scroll-trigger fade_in animation-order-${
                    index + 1
                  }`}
                  key={`thumb-${src}-${index}`}
                >
                  <button
                    className={`thumbnail d-block position-relative${
                      index === activeMainIndex
                        ? " rbt-pdp-thumb-is-active"
                        : ""
                    }`}
                    type="button"
                  >
                    <span className="rbt-thumb-img-sm">
                      <GalleryImage
                        alt={alt}
                        frameClassName="rbt-rounded--4"
                        sizes={PDP_GALLERY_THUMB_IMAGE.sizes}
                        src={src}
                      />
                    </span>
                  </button>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
          {showThumbNavigation ? (
            <button
              ref={thumbNextRef}
              aria-label="Next product image thumbnail"
              className="rbt-pdp-thumb-nav-btn"
              type="button"
            >
              <i aria-hidden className="fa-regular fa-arrow-right" />
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
