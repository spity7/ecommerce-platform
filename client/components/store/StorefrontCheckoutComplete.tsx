"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOrder } from "@platform/api-client";
import type { OrderDto } from "@platform/shared";
import {
  formatOrderDate,
  formatOrderNumber,
  formatOrderStatus,
  formatOrderTotal,
  formatShippingAddress,
  getOrderDetailPath,
  orderStatusClass,
} from "@/lib/order-display";
import { useAuthSession } from "@/providers/auth-session-provider";
import OrderItemsList from "../other-pages/shop-user/OrderItemsList";

type StorefrontCheckoutCompleteProps = {
  orderId: string;
};

export default function StorefrontCheckoutComplete({
  orderId,
}: StorefrontCheckoutCompleteProps) {
  const { user, loading: authLoading } = useAuthSession();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchOrder(orderId)
      .then((response) => {
        if (!cancelled) {
          setOrder(response);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("We could not load your order confirmation.");
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
  }, [orderId]);

  if (authLoading || loading) {
    return (
      <div className="rbt-component-area rbt-cart-page rbt-section-gapBottom rbt-bg-color-white">
        <div className="container">
          <p className="mb--0">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rbt-component-area rbt-cart-page rbt-section-gapBottom rbt-bg-color-white">
        <div className="container">
          <p className="mb--16">Sign in to view your order confirmation.</p>
          <Link className="rbt-btn" href="/signin">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rbt-component-area rbt-cart-page rbt-section-gapBottom rbt-bg-color-white">
        <div className="container">
          <p className="rbt-text-color-danger mb--16">
            {error ?? "Order not found."}
          </p>
          <Link className="rbt-btn" href="/my-order-history">
            View order history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rbt-component-area rbt-cart-page rbt-section-gapBottom rbt-bg-color-white">
      <div className="container">
        <div className="row row--12 mt_dec--24 justify-content-center">
          <div className="col-xl-8 col-12 mt--24 rbt-scrollable-content rbt-checkout-single-content">
            <div className="w-100 pt-sm-2 pt-md-3 pt-lg-4 pb-lg-4 pb-xl-5 px-3 px-sm-4 pe-lg-0 ps-lg-5">
              <div className="d-flex align-items-sm-center border-bottom pb-3 pb-md-4 active">
                <div className="rbt-checkout-step rbt-bg-color-success rbt-text-color-white">
                  <i className="fa-solid fa-check" />
                </div>
                <div className="w-100 ps-3">
                  <div className="fs-sm mb-1">
                    Order #{formatOrderNumber(order.id)}
                  </div>
                  <div className="d-sm-flex align-items-center">
                    <h1 className="h4 mb-0 me-3">Thank you for your order!</h1>
                    <div className="nav mt-2 mt-sm-0 ms-auto rbt-link-hover">
                      <Link
                        className="nav-link p-0"
                        href={getOrderDetailPath(order.id)}
                      >
                        View order details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-4 pt-3 pb-4 mt-3">
                <div>
                  <h3 className="h6 mb-2">Placed</h3>
                  <p className="fs-sm mb-0">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="h6 mb-2">Status</h3>
                  <span className={orderStatusClass(order.status)}>
                    {formatOrderStatus(order.status)}
                  </span>
                </div>
                {order.shippingAddress ? (
                  <div>
                    <h3 className="h6 mb-2">Delivery</h3>
                    <p
                      className="fs-sm mb-0"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {formatShippingAddress(order.shippingAddress)}
                    </p>
                    {order.shippingAddress.phone ? (
                      <p className="fs-sm mb-0 mt-2">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <div>
                  <h3 className="h6 mb-2">Payment</h3>
                  <p className="fs-sm mb-0">Cash on delivery</p>
                </div>
              </div>

              <div className="rbt-transparent-table-one-wrapper rbt-has-bg-gray p--24">
                <h5 className="title mb--24">Order summary</h5>
                <OrderItemsList items={order.items} />
                <hr />
                <p className="mb--0 b2">
                  <strong>Total: {formatOrderTotal(order.total)}</strong>
                </p>
              </div>

              <div className="d-flex flex-wrap gap-3 pt-4 pt-md-5 mt-2 mt-sm-3 mt-md-0">
                <Link className="rbt-btn" href="/shop">
                  Continue shopping
                </Link>
                <Link
                  className="rbt-btn rbt-btn-border"
                  href="/my-order-history"
                >
                  View all orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
