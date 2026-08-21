"use client";

import ReviewSlider from "./ReviewSlider";
import { StorefrontSignInShell } from "@/components/auth/storefront-sign-in";
import { getStorefrontSiteConfig } from "@/lib/site";

export default function Signin() {
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
                  <StorefrontSignInShell />
                ) : (
                  <p className="mb--0">
                    Customer sign-in is not enabled for this site.
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
