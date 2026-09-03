"use client";

import Sidebar from "@/components/other-pages/shop-user/Sidebar";
import AccountInfoPanel from "@/components/other-pages/shop-user/AccountInfoPanel";
import { AccountInfoGuardProvider } from "@/components/other-pages/shop-user/AccountInfoGuard";

export default function AccountInfoPageClient() {
  return (
    <AccountInfoGuardProvider>
      <div className="row row--12 mt_dec--24">
        <div className="col-12 col-md-12 col-lg-4 col-xl-3 mt--24">
          <Sidebar />
        </div>
        <div className="col-12 col-md-12 col-lg-8 col-xl-9 mt--24">
          <AccountInfoPanel />
        </div>
      </div>
    </AccountInfoGuardProvider>
  );
}
