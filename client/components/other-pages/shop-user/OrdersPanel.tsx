"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOrders } from "@platform/api-client";
import type { OrderDto } from "@platform/shared";
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
    return <p className="mb--0">Loading orders…</p>;
  }

  if (error) {
    return <p className="rbt-text-color-danger mb--0">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <p className="mb--16">You have no orders yet.</p>
        <Link className="rbt-btn" href="/shop">
          Browse products
        </Link>
      </div>
    );
  }

  return (
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
  );
}
