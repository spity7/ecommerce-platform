"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import Tooltip from "@/components/common/ui/Tooltip";
import { useStorefrontAdminBlocksCustomerUi } from "@/hooks/use-storefront-admin-blocks-customer-ui";
import { STOREFRONT_CUSTOMER_ACCOUNT_HINT } from "@/lib/storefront-customer-access";

type TooltipSide = "top" | "right" | "bottom" | "left";

const DISABLED_CHECKOUT_STYLE: CSSProperties = {
  background: "#e9ecef",
  boxShadow: "none",
  color: "#6c757d",
  cursor: "not-allowed",
};

type CustomerAccountLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  disabledHint?: string;
  onClick?: () => void;
  tooltipPlacement?: TooltipSide;
};

function DisabledCustomerControl({
  className,
  children,
  disabledHint,
  tooltipPlacement,
  showTooltip,
}: {
  className?: string;
  children: ReactNode;
  disabledHint: string;
  tooltipPlacement: TooltipSide;
  showTooltip: boolean;
}) {
  const control = (
    <span
      aria-disabled="true"
      className={[className, "rbt-customer-action-disabled"]
        .filter(Boolean)
        .join(" ")}
      data-storefront-customer-blocked="true"
      role="link"
      style={DISABLED_CHECKOUT_STYLE}
      tabIndex={0}
    >
      {children}
    </span>
  );

  if (!showTooltip) {
    return control;
  }

  return (
    <Tooltip content={disabledHint} placement={tooltipPlacement}>
      {control}
    </Tooltip>
  );
}

export function CustomerAccountLink({
  href,
  className,
  children,
  disabledHint = STOREFRONT_CUSTOMER_ACCOUNT_HINT,
  onClick,
  tooltipPlacement = "top",
}: CustomerAccountLinkProps) {
  const { blocked, resolving } = useStorefrontAdminBlocksCustomerUi();

  if (blocked) {
    return (
      <DisabledCustomerControl
        className={className}
        disabledHint={disabledHint}
        showTooltip
        tooltipPlacement={tooltipPlacement}
      >
        {children}
      </DisabledCustomerControl>
    );
  }

  if (resolving) {
    return (
      <DisabledCustomerControl
        className={className}
        disabledHint={disabledHint}
        showTooltip={false}
        tooltipPlacement={tooltipPlacement}
      >
        {children}
      </DisabledCustomerControl>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
