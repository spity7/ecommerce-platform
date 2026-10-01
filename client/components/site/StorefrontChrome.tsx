import Footer7 from "@/components/footers/Footer7";
import Header13 from "@/components/headers/Header13";
import {
  getSiteChromeBranding,
  type SiteChromeBranding,
} from "@/lib/site-branding";

type StorefrontChromeProps = {
  children: React.ReactNode;
  branding?: SiteChromeBranding;
  /** Use false on account-style pages without a hero (avoids content underlap). */
  headerTransparent?: boolean;
};

export function StorefrontChrome({
  children,
  branding,
  headerTransparent = true,
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
