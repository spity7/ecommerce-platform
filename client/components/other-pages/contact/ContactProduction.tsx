import { PhoneReceiverIcon, EnvelopeIcon } from "../../svg-icons";
import Tooltip from "@/components/common/ui/Tooltip";
import { SiteContactEmailLink } from "@/components/site/SiteContactLinks";
import { getSiteContactInfo } from "@/lib/site-branding";
import { getStorefrontSiteConfig } from "@/lib/site";
import ContactForm from "./ContactForm";

export default function ContactProduction() {
  const site = getStorefrontSiteConfig();
  const contact = getSiteContactInfo(site);

  return (
    <div className="rbt-component-area rbt-bg-color-gray-light">
      <div className="container">
        <div className="row row--24 row--16 mt_dec--24">
          <div className="col-12 col-xl-6 mt--24">
            <div className="rbt-component-section-title rbt-gap--4 mb--24 p-0 border-0 text-left">
              <h2 className="rbt-title h1 rbt-scroll-trigger fade_in animation-order-2 mb--16">
                <span className="rbt-bold--text">Contact {site.name}</span>
              </h2>
              <p className="desc mb--0">
                {site.description} Reach us by phone or email, or send a message
                using the form.
              </p>
            </div>
            <div className="rbt-btn-grp justify-content-start rbt-gap--16 flex-wrap">
              {contact.phoneHref ? (
                <Tooltip content="Call us" placement="top">
                  <a
                    href={contact.phoneHref}
                    className="rbt-trns-modern-btn tooltips"
                  >
                    <span className="icon">
                      <PhoneReceiverIcon />
                    </span>
                    {contact.phone}
                  </a>
                </Tooltip>
              ) : null}
              {contact.emailHref ? (
                <Tooltip content="Email us" placement="top">
                  <a
                    href={contact.emailHref}
                    className="rbt-trns-modern-btn tooltips"
                  >
                    <span className="icon">
                      <EnvelopeIcon />
                    </span>
                    {contact.email}
                  </a>
                </Tooltip>
              ) : null}
            </div>
            <div className="row row--16 mt--24">
              <div className="col-12 mt--24">
                <div className="rbt-location-card style-two">
                  <div className="inner">
                    <h6 className="rbt-location-card-title">
                      <i className="fa-sharp fa-regular fa-headset mr--4" />
                      Customer support
                    </h6>
                    <p className="rbt-location-card-text">{site.tagline}</p>
                    <ul className="rbt-contact-info-list">
                      {contact.phoneHref ? (
                        <li>
                          <span>Phone: </span>
                          <a
                            href={contact.phoneHref}
                            className="rbt-contact-info-single color-primary"
                          >
                            {contact.phone}
                          </a>
                        </li>
                      ) : null}
                      {contact.emailHref ? (
                        <li>
                          <span>Email: </span>
                          <SiteContactEmailLink
                            className="rbt-contact-info-single color-primary"
                          />
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-6 mt--24">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
