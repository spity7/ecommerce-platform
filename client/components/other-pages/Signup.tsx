"use client";

import ReviewSlider from "./ReviewSlider";
import { StorefrontSignUpShell } from "@/components/auth/storefront-sign-up";
import { getStorefrontSiteConfig } from "@/lib/site";

export default function Signup() {
  const site = getStorefrontSiteConfig();
  const useApiAuth = site.features.customerAuth;

  return (
    <div className="rbt-component-area rbt-section-gap2Bottom rbt-section-gap2Top">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
            <div className="rbt-login-form">
              <div className="rbt-login-form-inner">
                {useApiAuth ? (
                  <StorefrontSignUpShell />
                ) : (
                  <p className="mb--0">
                    Customer registration is not enabled for this site.
                  </p>
                )}
                <ReviewSlider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
