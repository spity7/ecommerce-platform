"use client";

import Link from "next/link";
import ModalTriggerButton from "@/components/action-buttons/ModalTriggerButton";
import Tooltip from "@/components/common/ui/Tooltip";
import { getStorefrontSiteConfig } from "@/lib/site";
import { useAuthSession } from "@/providers/auth-session-provider";

type HeaderAuthActionProps = {
  className?: string;
};

export default function HeaderAuthAction({ className }: HeaderAuthActionProps) {
  const site = getStorefrontSiteConfig();
  const { user, loading } = useAuthSession();

  if (!site.features.customerAuth) {
    return (
      <Tooltip content="Sign In" placement="bottom">
        <ModalTriggerButton className={className} openModalName="signinModal">
          <i className="fa-regular fa-user" />
        </ModalTriggerButton>
      </Tooltip>
    );
  }

  const tooltipLabel = loading ? "Sign In" : user ? "Account" : "Sign In";
  const href = user ? "/account-info" : "/signin";

  return (
    <Tooltip content={tooltipLabel} placement="bottom">
      <Link className={className} href={href}>
        <i className="fa-regular fa-user" />
      </Link>
    </Tooltip>
  );
}
