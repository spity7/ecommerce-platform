import Footer7 from "@/components/footers/Footer7";
import Header13 from "@/components/headers/Header13";
import {
  getSiteChromeBranding,
  type SiteChromeBranding,
} from "@/lib/site-branding";

type StorefrontChromeProps = {
  children: React.ReactNode;
  branding?: SiteChromeBranding;
};

export function StorefrontChrome({
  children,
  branding,
}: StorefrontChromeProps) {
  const chromeBranding = branding ?? getSiteChromeBranding();

  return (
    <>
      <Header13 branding={chromeBranding} sticky={true} />
      {children}
      <Footer7 branding={chromeBranding} />
    </>
  );
}
