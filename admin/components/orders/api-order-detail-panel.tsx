"use client";

import Image from "next/image";
import { ADMIN_LIST_ROW_THUMB } from "@/lib/catalog-image-display";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchOrder, platformApi } from "@platform/api-client";
import { useBusyActionGuard } from "@platform/react-busy";
import type { OrderDto, OrderStatus } from "@platform/shared";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { OrderStatusConfirmDialog } from "@/components/orders/order-status-confirm-dialog";
import { OrderStatusSelect } from "@/components/orders/order-status-select";
import { UserProfileAvatar } from "@/components/ui/user-profile-avatar";
import { routes } from "@/config/routes";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type ApiOrderDetailPanelProps = {
  orderId: string;
};

export function ApiOrderDetailPanel({ orderId }: ApiOrderDetailPanelProps) {
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const { disabled } = useBusyActionGuard({ active: updatingStatus });

  const loadOrder = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchOrder(orderId);
      setOrder(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  function requestStatusChange(status: OrderStatus) {
    if (!order || status === order.status || updatingStatus) {
      return;
    }
    setPendingStatus(status);
  }

  async function confirmStatusChange() {
    if (!order || !pendingStatus || updatingStatus) {
      return;
    }

    setStatusError(null);
    setUpdatingStatus(true);
    try {
      await platformApi.updateOrder(order.id, { status: pendingStatus });
      setPendingStatus(null);
      await loadOrder();
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Unable to update order status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return <p className="text-[14px] text-ink-600">Loading order…</p>;
  }

  if (error || !order) {
    return (
      <div className="rounded-base border border-warning-200 bg-warning-50 px-4 py-3 text-[14px] text-warning-700">
        {error ?? "Order not found."}
      </div>
    );
  }

  const customerLabel =
    order.customerName ??
    order.customerEmail ??
    `Customer ${order.userId.slice(-6)}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { href: routes.dashboard, label: "Home" },
              { href: routes.orders, label: "Orders" },
              { label: `Order #${order.id.slice(-8).toUpperCase()}` },
            ]}
          />
          <h1 className="text-[24px] font-semibold text-ink-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-[14px] text-ink-500">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        {disabled ? (
          <button
            aria-label="Back to orders"
            className="grid h-11 w-11 cursor-not-allowed place-items-center rounded-base border border-surface-line text-ink-700 opacity-60"
            disabled
            type="button"
          >
            <Icon className="h-4 w-4" name="arrow-left" />
          </button>
        ) : (
          <Link
            aria-label="Back to orders"
            className="grid h-11 w-11 place-items-center rounded-base border border-surface-line text-ink-700 hover:bg-surface-muted"
            href={routes.orders}
          >
            <Icon className="h-4 w-4" name="arrow-left" />
          </Link>
        )}
      </div>

      <section className="mb-6 grid gap-6 lg:grid-cols-3">
        <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-semibold text-ink-900">
            Order status
          </h2>
          <OrderStatusSelect
            ariaLabel="Update order status"
            className="w-full"
            disabled={disabled || pendingStatus !== null}
            onValueChange={requestStatusChange}
            size="default"
            value={order.status}
          />
          {statusError ? (
            <p className="mt-3 text-[13px] text-error-600">{statusError}</p>
          ) : null}
          {updatingStatus ? (
            <p className="mt-3 text-[13px] font-medium text-brand-600">
              Updating status…
            </p>
          ) : null}
        </article>

        <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-semibold text-ink-900">
            Customer
          </h2>
          <div className="mb-4 flex items-center gap-3">
            <UserProfileAvatar
              alt={customerLabel}
              avatarUrl={order.customerAvatarUrl}
              size={48}
            />
            <p className="font-semibold text-ink-900">{customerLabel}</p>
          </div>
          <dl className="space-y-3 text-[14px]">
            {order.customerEmail ? (
              <div>
                <dt className="text-ink-500">Email</dt>
                <dd className="font-medium text-ink-900">
                  {order.customerEmail}
                </dd>
              </div>
            ) : null}
          </dl>
        </article>

        <article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-semibold text-ink-900">
            Payment
          </h2>
          <p className="text-[14px] text-ink-700">Cash on delivery</p>
          <p className="mt-4 text-[20px] font-semibold text-ink-900">
            {formatMoney(order.total)}
          </p>
        </article>
      </section>

      {order.shippingAddress ? (
        <section className="mb-6 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="mb-4 text-[18px] font-semibold text-ink-900">
            Shipping address
          </h2>
          <p className="text-[14px] text-ink-700">
            {order.shippingAddress.name}
            <br />
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.country}
            {order.shippingAddress.phone ? (
              <>
                <br />
                {order.shippingAddress.phone}
              </>
            ) : null}
          </p>
        </section>
      ) : null}

      <section className="rounded-card border border-surface-line bg-surface-card shadow-card">
        <div className="border-b border-surface-line px-6 py-4">
          <h2 className="text-[18px] font-semibold text-ink-900">Line items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[14px]">
            <thead className="bg-surface-muted text-ink-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Qty</th>
                <th className="px-6 py-3 font-medium">Unit</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  className="border-t border-surface-line"
                  key={`${item.productId}-${item.productSlug}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.productImage ? (
                        <Image
                          alt={item.productName}
                          className="h-12 w-12 rounded-base object-cover"
                          src={item.productImage}
                          {...ADMIN_LIST_ROW_THUMB}
                        />
                      ) : null}
                      <span className="font-medium text-ink-900">
                        {item.productName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{formatMoney(item.price)}</td>
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    {formatMoney(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <OrderStatusConfirmDialog
        customerLabel={customerLabel}
        loading={updatingStatus}
        nextStatus={pendingStatus}
        onClose={() => setPendingStatus(null)}
        onConfirm={() => void confirmStatusChange()}
        open={pendingStatus !== null}
        orderLabel={`#${order.id.slice(-8).toUpperCase()}`}
        previousStatus={order.status}
      />
    </>
  );
}
