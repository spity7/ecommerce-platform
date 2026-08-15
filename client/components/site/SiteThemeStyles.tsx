import { getStorefrontSiteConfig } from "@/lib/site";

export function SiteThemeStyles() {
  const site = getStorefrontSiteConfig();

  return (
    <style>{`
      :root {
        --site-primary-color: ${site.theme.primaryColor};
        --site-secondary-color: ${site.theme.secondaryColor};
        --site-font-family: ${site.theme.fontFamily};
      }
    `}</style>
  );
}
