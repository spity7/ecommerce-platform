import type { OrderDto, OrderStatus } from "@platform/shared";
import type { Order } from "@/data/admin/operations";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function mapStatusToAdmin(status: OrderStatus): Order["status"] {
  switch (status) {
    case "delivered":
      return "completed";
    case "cancelled":
      return "failed";
    default:
      return "delivering";
  }
}

export function mapOrderDtoToAdminOrder(order: OrderDto): Order {
  const customerLabel =
    order.customerName ??
    order.customerEmail ??
    `Customer ${order.userId.slice(-6)}`;

  return {
    id: order.id.slice(-8).toUpperCase(),
    customer: customerLabel,
    status: mapStatusToAdmin(order.status),
    total: formatMoney(order.total),
    added: formatDate(order.createdAt),
    modified: formatDate(order.updatedAt),
  };
}

export type ApiOrderRow = Order & {
  apiId: string;
  apiStatus: OrderStatus;
  customerEmail?: string;
};

export function mapOrderDtoToApiOrderRow(order: OrderDto): ApiOrderRow {
  const mapped = mapOrderDtoToAdminOrder(order);
  return {
    ...mapped,
    apiId: order.id,
    apiStatus: order.status,
    customerEmail: order.customerEmail,
  };
}
