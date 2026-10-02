import Footer7 from "@/components/footers/Footer7";
import {
  ProductionHeader13,
  ProductionStorefrontShell,
} from "@/components/site/ProductionStorefrontShell";
import {
  getSiteChromeBranding,
  type SiteChromeBranding,
} from "@/lib/site-branding";

type StorefrontChromeProps = {
  children: React.ReactNode;
  branding?: SiteChromeBranding;
  /** Opt in to overlay header only on full-bleed hero pages; default keeps header in flow. */
  headerTransparent?: boolean;
};

export function StorefrontChrome({
  children,
  branding,
  headerTransparent = false,
}: StorefrontChromeProps) {
  const chromeBranding = branding ?? getSiteChromeBranding();

  return (
    <ProductionStorefrontShell>
      <ProductionHeader13
        branding={chromeBranding}
        sticky={true}
        transparent={headerTransparent}
      />
      {children}
      <Footer7 branding={chromeBranding} />
    </ProductionStorefrontShell>
  );
}
