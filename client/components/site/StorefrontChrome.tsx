import Footer7 from "@/components/footers/Footer7";
import Header13 from "@/components/headers/Header13";
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
    <>
      <Header13
        branding={chromeBranding}
        sticky={true}
        transparent={headerTransparent}
      />
      {children}
      <Footer7 branding={chromeBranding} />
    </>
  );
}
