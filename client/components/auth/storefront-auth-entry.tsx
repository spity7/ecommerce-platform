"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModalTriggerButton from "@/components/action-buttons/ModalTriggerButton";
import Popover from "@/components/common/ui/Popover";
import Tooltip from "@/components/common/ui/Tooltip";
import { getStorefrontSiteConfig } from "@/lib/site";
import { clearSession } from "@/lib/session";
import { useAuthSession } from "@/providers/auth-session-provider";

function useStorefrontAuthEntry() {
  const site = getStorefrontSiteConfig();
  const { user, loading } = useAuthSession();
  const router = useRouter();

  async function handleLogout() {
    await clearSession();
    window.dispatchEvent(new Event("auth:session-updated"));
    router.push("/signin");
    router.refresh();
  }

  return {
    customerAuth: site.features.customerAuth,
    user,
    loading,
    handleLogout,
  };
}

function SignedInMenu({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { handleLogout } = useStorefrontAuthEntry();

  return (
    <Popover
      placement="bottom"
      content={
        <div className="d-flex flex-column gap-2">
          <Link className="rbt-link-hover b3" href="/account-info">
            My account
          </Link>
          <button
            className="rbt-link-hover b3 border-0 bg-transparent p-0 text-start"
            onClick={() => void handleLogout()}
            type="button"
          >
            Log out
          </button>
        </div>
      }
    >
      <button className={className} type="button">
        {children}
      </button>
    </Popover>
  );
}

type AuthIconButtonProps = {
  className?: string;
};

export function AuthIconButton({ className }: AuthIconButtonProps) {
  const { customerAuth, user, loading } = useStorefrontAuthEntry();

  if (!customerAuth) {
    return (
      <Tooltip content="Sign In" placement="bottom">
        <ModalTriggerButton className={className} openModalName="signinModal">
          <i className="fa-regular fa-user" />
        </ModalTriggerButton>
      </Tooltip>
    );
  }

  if (loading) {
    return (
      <span className={className} aria-hidden="true">
        <i className="fa-regular fa-user" />
      </span>
    );
  }

  if (user) {
    return (
      <Tooltip content="Account" placement="bottom">
        <SignedInMenu className={className}>
          <i className="fa-regular fa-user" />
        </SignedInMenu>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Sign In" placement="bottom">
      <Link className={className} href="/signin">
        <i className="fa-regular fa-user" />
      </Link>
    </Tooltip>
  );
}

type AuthAccessBoxProps = {
  wrapperClassName?: string;
  iconClassName?: string;
  title?: string;
  subtitle?: string;
};

export function AuthAccessBox({
  wrapperClassName = "rbt-access-box-wrapper",
  iconClassName = "rbt-round-btn rbt-bg-static-gray",
  title = "Log in/Sign Up",
  subtitle = "Access Account",
}: AuthAccessBoxProps) {
  const { customerAuth, user, loading } = useStorefrontAuthEntry();

  if (!customerAuth) {
    return (
      <ModalTriggerButton
        as="div"
        className={wrapperClassName}
        openModalName="signinModal"
      >
        <div className={iconClassName}>
          <i className="fa-regular fa-user" />
        </div>
        <div className="content">
          <p>{title}</p>
          <span>{subtitle}</span>
        </div>
      </ModalTriggerButton>
    );
  }

  if (loading) {
    return (
      <div className={wrapperClassName}>
        <div className={iconClassName}>
          <i className="fa-regular fa-user" />
        </div>
        <div className="content">
          <p>{title}</p>
          <span>{subtitle}</span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <SignedInMenu className={wrapperClassName}>
        <div className={iconClassName}>
          <i className="fa-regular fa-user" />
        </div>
        <div className="content">
          <p>{user.name}</p>
          <span>My account</span>
        </div>
      </SignedInMenu>
    );
  }

  return (
    <Link className={wrapperClassName} href="/signin">
      <div className={iconClassName}>
        <i className="fa-regular fa-user" />
      </div>
      <div className="content">
        <p>{title}</p>
        <span>{subtitle}</span>
      </div>
    </Link>
  );
}

type ToolbarProfileActionProps = {
  className?: string;
  label: string;
};

export function ToolbarProfileAction({
  className,
  label,
}: ToolbarProfileActionProps) {
  const { customerAuth, user, loading, handleLogout } = useStorefrontAuthEntry();

  if (!customerAuth) {
    return (
      <ModalTriggerButton
        as="div"
        className={className}
        openModalName="signinModal"
      >
        <i className="fa-regular fa-user" />
        <span className="rbt-toolbar-label"> {label}</span>
      </ModalTriggerButton>
    );
  }

  if (loading) {
    return (
      <div className={className}>
        <i className="fa-regular fa-user" />
        <span className="rbt-toolbar-label"> {label}</span>
      </div>
    );
  }

  if (user) {
    return (
      <Popover
        placement="top"
        content={
          <div className="d-flex flex-column gap-2">
            <Link className="rbt-link-hover b3" href="/account-info">
              My account
            </Link>
            <button
              className="rbt-link-hover b3 border-0 bg-transparent p-0 text-start"
              onClick={() => void handleLogout()}
              type="button"
            >
              Log out
            </button>
          </div>
        }
      >
        <button className={className} type="button">
          <i className="fa-regular fa-user" />
          <span className="rbt-toolbar-label"> {label}</span>
        </button>
      </Popover>
    );
  }

  return (
    <Link className={className} href="/signin">
      <i className="fa-regular fa-user" />
      <span className="rbt-toolbar-label"> {label}</span>
    </Link>
  );
}

export default AuthIconButton;
