import { Metadata } from "next";
import BlogBlock01 from "@/components/elements/element-blog-styles/BlogBlock01";
import BlogBlock02 from "@/components/elements/element-blog-styles/BlogBlock02";
import BlogBlock03 from "@/components/elements/element-blog-styles/BlogBlock03";
import BlogBlock04 from "@/components/elements/element-blog-styles/BlogBlock04";
import BlogBlock05 from "@/components/elements/element-blog-styles/BlogBlock05";
import BlogBlock06 from "@/components/elements/element-blog-styles/BlogBlock06";
import ElementsHero from "@/components/elements/ElementsHero";
export const metadata: Metadata = {
  title:
    "Element Blog Styles | Discover premium cosmetics and skincare products at Beauty Station.",
  description:
    "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function ElementBlogStylesPage() {
  return (
    <>
      <ElementsHero
        title={
          <>
            Exclusive <span>Blog Styles</span>
          </>
        }
      />
      <BlogBlock01 />
      <BlogBlock02 />
      <BlogBlock03 />
      <BlogBlock04 />
      <BlogBlock05 />
      <BlogBlock06 />
    </>
  );
}
