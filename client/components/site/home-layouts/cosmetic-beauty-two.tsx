import Footer7 from "@/components/footers/Footer7";
import {
  ProductionHeader13,
  ProductionStorefrontShell,
} from "@/components/site/ProductionStorefrontShell";
import { getSiteChromeBranding } from "@/lib/site-branding";
import Banner from "@/components/homes/home-cosmetic-beauty-two/Banner";
import Categories from "@/components/homes/home-cosmetic-beauty-two/Categories";
import Hero from "@/components/homes/home-cosmetic-beauty-two/Hero";
import InstagramPosts from "@/components/homes/home-cosmetic-beauty-two/InstagramPosts";
import Products1 from "@/components/homes/home-cosmetic-beauty-two/Products1";
import VideosSection from "@/components/common/other-components/VideosSection";

export default function CosmeticBeautyTwoHome() {
  const branding = getSiteChromeBranding();

  return (
    <ProductionStorefrontShell>
      <ProductionHeader13 branding={branding} sticky={true} />
      <Hero />
      <Categories />
      <Products1 />
      <Banner />
      <VideosSection />
      <InstagramPosts />
      <Footer7 branding={branding} />
    </ProductionStorefrontShell>
  );
}
