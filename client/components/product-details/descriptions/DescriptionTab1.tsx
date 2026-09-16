"use client";

import { GridMatrixIcon, WaveSquareIcon } from "../../svg-icons";
import Image from "next/image";
import ProductReviewsPanel from "./ProductReviewsPanel";
import {
  PRODUCT_FEATURES,
  PRODUCT_SPECIFICATIONS,
  type ProductSpecification,
  productFaqs,
} from "@/data/productDetails";
import type { StorefrontReview } from "@/lib/mappers/reviews";
import { useState } from "react";

export default function DescriptionTab1({
  description,
  parentClass = "rbt-tab rbt-product-single-details-tab rbt-fshape-tab",
  reviewsEnabled = true,
  productId,
  productName,
  averageRating,
  reviewCount,
  ratingBreakdown,
  reviews,
  useApiReviews = false,
}: {
  description?: string;
  parentClass?: string;
  reviewsEnabled?: boolean;
  productId?: string;
  productName?: string;
  averageRating?: number;
  reviewCount?: number;
  ratingBreakdown?: { star: number; count: number }[];
  reviews?: StorefrontReview[];
  useApiReviews?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specification" | "reviews" | "question"
  >("description");

  return (
    <>
      <div className={parentClass}>
        <div className="rbt-tab-nav-wrapper">
          <ul
            className="nav nav-tabs"
            id="rbt-single-productTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link${activeTab === "description" ? " active" : ""}`}
                onClick={() => {
                  setActiveTab("description");
                }}
              >
                Description
                <span className="rbt-fshape-portion rbt-fshape-left-portion">
                  <GridMatrixIcon />
                </span>
                <span className="rbt-fshape-portion rbt-fshape-right-portion">
                  <WaveSquareIcon />
                </span>
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link${activeTab === "specification" ? " active" : ""}`}
                onClick={() => {
                  setActiveTab("specification");
                }}
              >
                Specification
                <span className="rbt-fshape-portion rbt-fshape-left-portion">
                  <GridMatrixIcon />
                </span>
                <span className="rbt-fshape-portion rbt-fshape-right-portion">
                  <WaveSquareIcon />
                </span>
              </button>
            </li>
            {reviewsEnabled ? (
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link${activeTab === "reviews" ? " active" : ""}`}
                  onClick={() => {
                    setActiveTab("reviews");
                  }}
                >
                  Reviews
                  <span className="rbt-fshape-portion rbt-fshape-left-portion">
                    <GridMatrixIcon />
                  </span>
                  <span className="rbt-fshape-portion rbt-fshape-right-portion">
                    <WaveSquareIcon />
                  </span>
                </button>
              </li>
            ) : null}
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link${activeTab === "question" ? " active" : ""}`}
                onClick={() => {
                  setActiveTab("question");
                }}
              >
                Questions
                <span className="rbt-fshape-portion rbt-fshape-left-portion">
                  <GridMatrixIcon />
                </span>
                <span className="rbt-fshape-portion rbt-fshape-right-portion">
                  <WaveSquareIcon />
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="tab-pane fade active show">
              <div className="rbt-product-single-description">
                {description?.trim() ? (
                  <p className="rbt-block-desc b1 mb--0 mt--12">
                    {description}
                  </p>
                ) : (
                  <>
                    <h6 className="rbt-block-title mb--0">Immersive visuals</h6>
                    <p className="rbt-block-desc b1 mb--0 mt--12">
                      Quisque varius diam vel metus mattis, id aliquam diam
                      rhoncus. Proin vitae magna in dui finibus malesuada et at
                      nulla. Morbi elit ex, viverra vitae ante vel, blandit
                      feugiat ligula. Fusce fermentum iaculis nibh, at sodales
                      leo maximus a. Nullam ultricies sodales nunc, in
                      pellentesque lorem mattis quis. Cras imperdiet est in nunc
                      tristique lacinia. Nullam aliquam mauris eu accumsan
                      tincidunt. Suspendisse velit ex, aliquet vel ornare vel,
                      dignissim a tortor. Morbi ut sapien vitae odio accumsan
                      gravida. Morbi vitae erat auctor, eleifend nunc a,
                      lobortis neque. Praesent aliquam dignissim viverra.
                      Maecenas lacus odio, feugiat eu nunc sit amet, maximus
                      sagittis dolor.
                    </p>
                  </>
                )}
                {!description?.trim() ? (
                  <>
                    <div className="rbt-block-banner-img mt--32">
                      <Image
                        alt="Ecommerce Product Banner"
                        src="/assets/images/product-single/single-prd-banner/single-prd-banner-01.webp"
                        width={1840}
                        height={844}
                      />
                    </div>
                    <p className="rbt-block-desc b1 mb--0 mt--12">
                      Quisque varius diam vel metus mattis, id aliquam diam
                      rhoncus. Proin vitae magna in dui finibus malesuada et at
                      nulla. Morbi elit ex, viverra vitae ante vel, blandit
                      feugiat ligula. Fusce fermentum iaculis nibh, at sodales
                      leo maximus a. Nullam ultricies sodales nunc, in
                      pellentesque lorem mattis quis. Cras imperdiet est in nunc
                      tristique lacinia. Nullam aliquam mauris eu accumsan
                      tincidunt. Suspendisse velit ex, aliquet vel ornare vel,
                      dignissim a tortor. Morbi ut sapien vitae odio accumsan
                      gravida. Morbi vitae erat auctor, eleifend nunc a,
                      lobortis neque. Praesent aliquam dignissim viverra.
                      Maecenas lacus odio, feugiat eu nunc sit amet, maximus
                      sagittis dolor.
                    </p>
                    <p className="rbt-block-desc b1 mb--0 mt--12">
                      sunt in culpa qui officia deserunt mollit anim id est
                      laborum.nunc, in pellentesque lorem mattis quis. Cras
                      imperdiet est in nunc tristique lacinia. Nullam aliquam
                      mauris eu accumsan tincidunt. Suspendisse velit ex,
                      aliquet vel ornare vel, dignissim a tortor. Morbi ut
                      sapien vitae odio accumsan gravida. Morbi vitae erat
                      auctor, eleifend nunc a, lobortis neque. Praesent aliquam
                      dignissim viverra. Maecenas lacus odio, feugiat eu nunc
                      sit
                    </p>
                    <div className="rbt-block-banner-video mt--32">
                      <video
                        src="/assets/videos/prd-single-dtls-video-01.mp4"
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    </div>
                    <div className="rbt-prd-feature-area mt--32">
                      <div className="row row--12 mt_dec--24 rbt-mobile-row">
                        {PRODUCT_FEATURES.map((feature, index) => (
                          <div
                            className="col-lg-4 col-md-4 col-sm-6 col-12 mt--24"
                            key={index}
                          >
                            <div className="rbt-prd-feature-card rbt-bg-color-brand-50 rbt-curved-style-box">
                              <div className="rbt-inner text-center">
                                <span className="icon">
                                  <i className={feature.icon} />
                                </span>
                                <p className="title b1">{feature.title}</p>
                                <p className="desc b2">{feature.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="rbt-block-desc b1 mb--0 mt--12">
                      Egestas purus a luctus ridiculus ac malesuada arcu a.
                      Euismod dapibus commodo metus phasellus blandit
                      suspendisse euismod orci tellus. Habitasse hendrerit dolor
                      euismod varius nisi. Platea praesent nisi ultrices rhoncus
                      volutpat nostra. Efficitur dui nec massa nulla nostra nunc
                      massa ornare fermentum. Parturient turpis per adipiscing
                      vestibulum donec tincidunt ligula. Purus tristique ut
                      dolor mollis ut cras scelerisque nec. Massa dis mus
                      senectus tortor ligula. Ullamcorper molestie placerat
                      bibendum hac aptent volutpat ad laoreet
                    </p>
                    <p className="rbt-block-desc b1 mb--0 mt--12">
                      Scelerisque sociosqu sagittis bibendum quam id; ultrices
                      placerat adipiscing. Imperdiet egestas ullamcorper cras
                      blandit himenaeos auctor lacus commodo. Feugiat quisque
                      nascetur tincidunt duis phasellus, sagittis euismod. Donec
                      nisl senectus risus nullam quisque vivamus. Dapibus
                      pulvinar lobortis auctor quam neque. Nibh at maximus
                      taciti mattis rutrum viverra. Dictum ipsum tortor nibh
                      parturient laoreet ullamcorper rhoncus tincidunt. At risus
                      aliquam ligula ut vivamus mi sodales volutpat. Cursus
                      sodales hendrerit donec efficitur penatibus.
                    </p>
                    <div className="rbt-block-banner-img mt--32">
                      <Image
                        alt="Ecommerce Product Banner"
                        src="/assets/images/product-single/single-prd-banner/single-prd-banner-02.webp"
                        width={1840}
                        height={844}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
          {activeTab === "specification" && (
            <div className="tab-pane fade active show">
              <div className="rbt-prd-single-specification-info">
                {PRODUCT_SPECIFICATIONS.map(
                  (spec: ProductSpecification, index: number) => (
                    <div className="rbt-single-specification" key={index}>
                      <label className="b1 title">{spec.label}</label>
                      <div className="rbt-specification-content">
                        <span className="desc">{spec.value}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {activeTab === "reviews" && reviewsEnabled ? (
            <ProductReviewsPanel
              averageRating={averageRating}
              productId={productId}
              productName={productName}
              ratingBreakdown={ratingBreakdown}
              reviewCount={reviewCount}
              reviews={reviews}
              useApiData={useApiReviews}
            />
          ) : null}
          {activeTab === "question" && (
            <div className="tab-pane fade active show">
              <div className="rbt-prd-single-faq-section">
                <div className="rbt-section-title-area rbt-bg-color-gray-light">
                  <h6 className="rbt-block-title mb--0">
                    Frequently Asked Questions? Look here
                  </h6>
                </div>
                <div className="rbt-accordion-style rbt-accordion-01 accordion">
                  <div className="accordion" id="accordionExampleb4">
                    {productFaqs.map((faq, index) => (
                      <div className="accordion-item card" key={faq.id}>
                        <h2
                          className="accordion-header card-header"
                          id={`heading${index}`}
                        >
                          <button
                            className={`accordion-button${index !== 0 ? " collapsed" : ""}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${faq.id}`}
                            aria-expanded={index === 0 ? "true" : "false"}
                            aria-controls={faq.id}
                          >
                            {faq.question}
                          </button>
                        </h2>
                        <div
                          id={faq.id}
                          className={`accordion-collapse collapse${index === 0 ? " show" : ""}`}
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#accordionExampleb4"
                        >
                          <div className="accordion-body card-body">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
