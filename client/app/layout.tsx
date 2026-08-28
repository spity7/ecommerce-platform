import { Cabin, Caveat, Bebas_Neue, Caprasimo } from "next/font/google";
import LayoutEffectsLoader from "@/components/common/other-components/LayoutEffectsLoader";
import BootstrapJsLoader from "@/components/common/other-components/BootstrapJsLoader";
import { SiteThemeStyles } from "@/components/site/SiteThemeStyles";
import { getStorefrontSiteConfig } from "@/lib/site";

import LayoutModals from "@/components/common/other-components/LayoutModals";
import Toolbar from "@/components/modals/Toolbar";
import { AppProviders } from "@/providers/app-providers";
import type { Metadata } from "next";

import "../public/assets/scss/main.scss";

const site = getStorefrontSiteConfig();

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cabin",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});
const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caprasimo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: "website",
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cabin.variable} ${caveat.variable} ${bebasNeue.variable} ${caprasimo.variable}`}
      suppressHydrationWarning
    >
      <body className={cabin.className} suppressHydrationWarning>
        <SiteThemeStyles />
        <BootstrapJsLoader />
        <LayoutEffectsLoader />
        <AppProviders>
          <main id="main-content">{children}</main>
          <Toolbar />
          <LayoutModals />
        </AppProviders>
      </body>
    </html>
  );
}
