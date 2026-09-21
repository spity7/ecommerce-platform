import type { Metadata } from "next";
import Link from "next/link";
import { fetchCategories } from "@platform/api-client";
import {
  CategoryScroller,
  type DashboardCategoryItem,
} from "@/components/dashboard/category-scroller";
import {
  EarningChart,
  RevenueChart,
  VisitorsChart,
} from "@/components/dashboard/charts";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  BestSellingProductsTable,
  RecentOrdersTable,
} from "@/components/dashboard/dashboard-tables";
import { SalesAnalyticsPanel } from "@/components/dashboard/sales-analytics-panel";
import { TodoList } from "@/components/dashboard/todo-list";
import { StatCard } from "@/components/layout/dashboard-widgets";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import {
  dashboardCategories,
  dashboardStats,
  recentOrders,
  topCategories,
  topProducts,
  transactions,
} from "@/data/dashboard/data";
import { mapCategoryDto } from "@/lib/mappers/catalog";
import { productsListPath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Dashboard",
};

function toDashboardCategories(
  categories: ReturnType<typeof mapCategoryDto>[]
): DashboardCategoryItem[] {
  return [...categories]
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "published" ? -1 : 1;
      }
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    })
    .map((category) => ({
      href: productsListPath({ categoryId: category.id }),
      image: category.image,
      label: category.name,
    }));
}

export default async function DashboardPage() {
  let categories: DashboardCategoryItem[] = dashboardCategories.map(
    (category) => ({
      href: routes.products,
      image: category.image,
      label: category.label,
    })
  );

  try {
    const response = await fetchCategories({ limit: 100 });
    const live = toDashboardCategories(response.data.map(mapCategoryDto));
    if (live.length > 0) {
      categories = live;
    }
  } catch {
    // Keep template categories when the catalog API is unavailable.
  }

  return (
    <>
      <DashboardHeader />
      <section
        aria-label="Dashboard metrics"
        className="grid gap-3 md:gap-4 lg:gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <CategoryScroller categories={categories} />
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.95fr)]">
        <RevenueReport />
        <BestSellingProductsTable products={topProducts} />
      </section>
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesAnalyticsPanel />
        <TopCategories />
      </section>
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]">
        <RecentOrdersTable orders={recentOrders} />
        <Earning />
      </section>
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Transactions />
        <Visitors />
        <TodoList />
      </section>
    </>
  );
}

function RevenueReport() {
  return (
    <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] font-medium text-ink-900">Revenue Report</h2>
        <div
          className="flex rounded-base border border-surface-line bg-surface-body p-1 text-[13px] font-semibold text-ink-500"
          data-revenue-toggle
        >
          <button
            className="rounded-base bg-surface-card px-3 py-1 text-brand-600 shadow-card"
            data-range="year"
            type="button"
          >
            Year
          </button>
          <button
            className="rounded-base px-3 py-1 hover:text-ink-900"
            data-range="month"
            type="button"
          >
            Month
          </button>
        </div>
      </div>
      <RevenueChart />
    </article>
  );
}

function TopCategories() {
  return (
    <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-medium text-ink-900">
            Top Categories
          </h2>
          <p className="mt-1 text-[13px] text-ink-400">
            Share of revenue this month.
          </p>
        </div>
        <Link
          className="text-[14px] font-semibold text-brand-600 hover:text-brand-700"
          href={routes.categories}
        >
          View all
        </Link>
      </div>
      <ul className="space-y-5">
        {topCategories.map((category) => (
          <li key={category.label}>
            <div className="mb-1.5 flex items-center justify-between text-[14px]">
              <span className="flex items-center gap-2 font-medium text-ink-900">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${category.colorClass}`}
                />
                {category.label}
              </span>
              <span className="text-ink-500">
                {category.value} {"\u00b7"} {category.percent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <span
                className={`block h-full rounded-full ${category.colorClass}`}
                style={{ width: `${category.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between border-t border-surface-line pt-4 text-[14px]">
        <span className="text-ink-500">Total revenue</span>
        <span className="text-[18px] font-semibold text-ink-900">$65.2k</span>
      </div>
    </article>
  );
}

function Earning() {
  return (
    <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <h2 className="text-[20px] font-medium text-ink-900">Earning</h2>
      <EarningChart />
    </article>
  );
}

function Transactions() {
  return (
    <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <h2 className="mb-4 text-[20px] font-medium text-ink-900">
        Transactions
      </h2>
      <ul className="space-y-4 text-[14px]">
        {transactions.map((transaction) => (
          <li className="flex items-center gap-3" key={transaction.label}>
            <span
              className={`grid h-10 w-10 place-items-center rounded-full ${transaction.iconClass}`}
            >
              <Icon className="h-5 w-5" name={transaction.icon} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-ink-900">
                {transaction.label}
              </span>
              <span className="text-[13px] text-ink-400">
                {transaction.meta}
              </span>
            </span>
            <span className={`font-semibold ${transaction.amountClass}`}>
              {transaction.amount}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Visitors() {
  return (
    <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <h2 className="mb-2 text-[20px] font-medium text-ink-900">Visitors</h2>
      <VisitorsChart />
    </article>
  );
}
