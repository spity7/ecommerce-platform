import Sidebar from "@/components/other-pages/shop-user/Sidebar";
import Notifications from "@/components/other-pages/shop-user/Notifications";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Notifications | Beauty Station | Cosmetics & Skincare",
  description:
    "Control your Beauty Station account and order notification settings.",
};

export default function page() {
  return (
    <>
      <div className="rbt-component-area rbt-section-gap rbt-bg-color-gray-light">
        <div className="container">
          <div className="row row--12 mt_dec--24">
            <div className="col-12 col-md-12 col-lg-4 col-xl-3 mt--24">
              <Sidebar />
            </div>
            <div className="col-12 col-md-12 col-lg-8 col-xl-9 mt--24">
              <Notifications />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
