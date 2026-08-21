"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@platform/api-client";
import type { OrderDto } from "@platform/shared";
import { getStorefrontSiteConfig } from "@/lib/site";
import Orders from "./Orders";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function statusClass(status: OrderDto["status"]): string {
  switch (status) {
    case "delivered":
      return "rbt-badge rbt-badge-bg-green rbt-badge-border rbt-badge-md rbt-badge-rounded";
    case "cancelled":
      return "rbt-badge rbt-badge-bg-danger rbt-badge-border rbt-badge-md rbt-badge-rounded";
    case "shipped":
    case "processing":
      return "rbt-badge rbt-badge-bg-warning rbt-badge-border rbt-badge-md rbt-badge-rounded";
    default:
      return "rbt-badge rbt-badge-border rbt-badge-md rbt-badge-rounded";
  }
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
    return <p className="mb--0">Loading orders…</p>;
  }

  if (error) {
    return <p className="rbt-text-color-danger mb--0">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="mb--0">You have no orders yet.</p>;
  }

  return (
    <div className="rbt-account-orders">
      {orders.map((order) => (
        <div key={order.id} className="rbt-account-order-item mb--24">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb--12">
            <p className="mb--0 b2 rbt-text-medium">
              Order #{order.id.slice(-8)}
            </p>
            <span className={statusClass(order.status)}>{order.status}</span>
          </div>
          <p className="mb--8 b3">
            {order.itemCount} items · {formatMoney(order.total)}
          </p>
          <ul className="mb--0 pl--0 list-unstyled">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.productId}`} className="b3">
                {item.productName} × {item.quantity} —{" "}
                {formatMoney(item.lineTotal)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
