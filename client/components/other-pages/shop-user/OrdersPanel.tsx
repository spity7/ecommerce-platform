"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { fetchOrders } from "@platform/api-client";
import type { OrderDto } from "@platform/shared";
import OrdersSectionSkeleton from "@/components/store/OrdersSectionSkeleton";
import {
  formatOrderDate,
  formatOrderNumber,
  formatOrderStatus,
  formatOrderTotal,
  getOrderDetailPath,
  orderStatusClass,
} from "@/lib/order-display";
import { getStorefrontSiteConfig } from "@/lib/site";
import Orders from "./Orders";
import OrdersEmptyState from "./OrdersEmptyState";

function OrdersPageHeader() {
  return (
    <div className="rbt-component-section-title rbt-gap--4 mb--24 p-0 border-0 text-center">
      <h2 className="rbt-title mb--8 rbt-orders-page-title">
        <span aria-hidden="true" className="rbt-orders-page-title__icon">
          <i className="fa-regular fa-bag-shopping" />
        </span>
        <span className="rbt-text-bold">My orders</span>
      </h2>
      <p className="description mx-auto mb--0">
        Track status, line items, and receipts for everything you have
        purchased.
      </p>
    </div>
  );
}

function OrdersPanelShell({ children }: { children: ReactNode }) {
  return (
    <div className="rbt-profile-content-area rbt-scrollable-content">
      <OrdersPageHeader />
      {children}
    </div>
  );
}

export default function OrdersPanel() {
  const site = getStorefrontSiteConfig();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(site.features.customerAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!site.features.customerAuth) {
      return;
    }

    let cancelled = false;

    void fetchOrders()
      .then((response) => {
        if (!cancelled) {
          setOrders(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [site.features.customerAuth]);

  if (!site.features.customerAuth) {
    return <Orders />;
  }

  if (loading) {
    return (
      <OrdersPanelShell>
        <OrdersSectionSkeleton />
      </OrdersPanelShell>
    );
  }

  if (error) {
    return (
      <OrdersPanelShell>
        <p className="rbt-text-color-danger mb--0 text-center">{error}</p>
      </OrdersPanelShell>
    );
  }

  if (orders.length === 0) {
    return (
      <OrdersPanelShell>
        <OrdersEmptyState />
      </OrdersPanelShell>
    );
  }

  return (
    <OrdersPanelShell>
      <div className="rbt-account-orders">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rbt-account-order-item mb--24 rbt-transparent-table-one-wrapper rbt-has-bg-gray p--24"
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb--12">
              <div>
                <p className="mb--4 b2 rbt-text-medium">
                  Order #{formatOrderNumber(order.id)}
                </p>
                <p className="mb--0 b3 rbt-text-color-gray-600">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>
              <span className={orderStatusClass(order.status)}>
                {formatOrderStatus(order.status)}
              </span>
            </div>
            <p className="mb--12 b3">
              {order.itemCount} items · {formatOrderTotal(order.total)}
            </p>
            <ul className="mb--16 pl--0 list-unstyled">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.productId}`} className="b3">
                  {item.productName} × {item.quantity} —{" "}
                  {formatOrderTotal(item.lineTotal)}
                </li>
              ))}
            </ul>
            <Link
              className="rbt-btn rbt-btn-sm"
              href={getOrderDetailPath(order.id)}
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    </OrdersPanelShell>
  );
}
