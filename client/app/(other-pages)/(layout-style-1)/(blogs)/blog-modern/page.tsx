import BlogSlider from "@/components/blogs/BlogSlider";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Modern | Beauty Station | Cosmetics & Skincare",
  description: "Modern, full-width Beauty Station blog layout with slider.",
};

export default function page() {
  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-light"
        subtitle=""
        hasHrLine
        title="Blog Modern"
      />

      <BlogSlider className="rbt-component-area rbt-blog-post-area rbt-bg-color-gray-light rbt-swiper-container-one rbt-swiper-container-one-blog rbt-arrow-between rbt-section-gap" />
    </>
  );
}
