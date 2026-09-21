"use client";

import Link from "next/link";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import { useAuthSession } from "@/providers/auth-session-provider";

function firstNameFrom(name: string | undefined): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first || null;
}

export function DashboardHeader() {
  const { user, loading } = useAuthSession();
  const firstName = firstNameFrom(user?.name) ?? (loading ? null : "Admin");
  const greeting = firstName
    ? `Welcome back, ${firstName} \u{1f44b}`
    : "Welcome back \u{1f44b}";

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center lg:justify-between lg:text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-ink-900 lg:text-[24px]">
          {greeting}
        </h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Here&apos;s what&apos;s happening in your store today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-base border border-surface-line px-4 text-[14px] font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
          type="button"
        >
          <Icon className="h-4 w-4" name="download" />
          Export
        </button>
        <Link
          className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700"
          href={routes.addProduct}
        >
          <Icon className="h-4 w-4" name="plus" />
          Add Product
        </Link>
      </div>
    </div>
  );
}
