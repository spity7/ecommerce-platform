import Blogs1 from "@/components/blogs/Blogs1";
import BlogSlider from "@/components/blogs/BlogSlider";
import Breadcrumb from "@/components/common/other-components/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Blog Infinite Scroll | Beauty Station | Cosmetics & Skincare",
  description: "Beauty Station blog listing page with infinite scroll experience.",
};

export default function page() {
  return (
    <>
      <Breadcrumb
        className="rbt-breadcrumb-two rbt-bg-color-gray-light"
        subtitle=""
        hasHrLine
        title="Blog Infinite Scroll"
      />
      <BlogSlider />
      <Blogs1 />
    </>
  );
}
