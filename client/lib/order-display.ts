import type { OrderDto } from "@platform/shared";
import { formatCurrency } from "@/lib/price";

export function formatOrderNumber(orderId: string): string {
  return orderId.slice(-8).toUpperCase();
}

export function formatOrderDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function formatOrderStatus(status: OrderDto["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function orderStatusClass(status: OrderDto["status"]): string {
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

export function formatShippingAddress(
  address: NonNullable<OrderDto["shippingAddress"]>
): string {
  const parts = [
    address.name,
    address.line1,
    [address.city, address.country].filter(Boolean).join(", "),
  ].filter(Boolean);

  return parts.join("\n");
}

export function formatOrderTotal(total: number): string {
  return formatCurrency(total);
}

export function getOrderDetailPath(orderId: string): string {
  return `/my-order-history/${orderId}`;
}
