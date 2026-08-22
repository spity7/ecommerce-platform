"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { clearSession } from "@/lib/session";
import { Icon } from "@/components/layout/icon";
import { cn } from "@/utils/cn";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await clearSession();
    router.push(routes.signIn);
    router.refresh();
  }

  return (
    <button
      aria-label="Logout"
      className={cn(
        "flex w-full items-center gap-3 rounded-base px-2 py-2 text-[14px] text-ink-700 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
        className
      )}
      onClick={() => void handleLogout()}
      role="menuitem"
      type="button"
    >
      <Icon className="h-[18px] w-[18px] text-ink-500" name="log-out" />
      <span className="nav-text">Logout</span>
    </button>
  );
}
