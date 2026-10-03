import { getStorefrontSiteConfig } from "@/lib/site";

export default function ContactMapProduction() {
  const mapEmbedUrl = getStorefrontSiteConfig().contact.mapEmbedUrl?.trim();
  if (!mapEmbedUrl) {
    return null;
  }

  return (
    <div className="rbt-component-area rbt-bg-color-gray-light">
      <div className="container">
        <div className="rbt-google-map bg-color-white rbt-section-gap2Top">
          <iframe
            className="w-100"
            src={mapEmbedUrl}
            height={600}
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store location map"
          />
        </div>
      </div>
    </div>
  );
}
