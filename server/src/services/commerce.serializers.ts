import type { CartDto, OrderDto } from "@platform/shared";
import type { CartDocument, CartItemDocument } from "../models/Cart.js";
import type { OrderDocument } from "../models/Order.js";

function toIsoString(value: Date | string | undefined): string {
  if (!value) {
    return new Date(0).toISOString();
  }
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapCartItem(item: CartItemDocument) {
  const lineTotal = item.quantity * item.price;
  return {
    id: item._id.toString(),
    productId: item.productId.toString(),
    quantity: item.quantity,
    productName: item.productName,
    productSlug: item.productSlug,
    productImage: item.productImage,
    price: item.price,
    lineTotal,
  };
}

export function toCartDto(doc: CartDocument): CartDto {
  const items = doc.items.map((item) => mapCartItem(item as CartItemDocument));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: doc._id.toString(),
    items,
    itemCount,
    subtotal,
    guestSessionId: doc.guestSessionId ?? undefined,
  };
}

export function toOrderDto(
  doc: OrderDocument,
  customer?: { name: string; email: string }
): OrderDto {
  const items = doc.items.map((item) => ({
    productId: item.productId.toString(),
    quantity: item.quantity,
    productName: item.productName,
    productSlug: item.productSlug,
    productImage: item.productImage,
    price: item.price,
    lineTotal: item.quantity * item.price,
  }));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    customerName: customer?.name,
    customerEmail: customer?.email,
    status: doc.status,
    items,
    itemCount,
    subtotal: doc.subtotal,
    total: doc.total,
    shippingAddress: doc.shippingAddress
      ? {
          name: doc.shippingAddress.name,
          line1: doc.shippingAddress.line1,
          city: doc.shippingAddress.city,
          country: doc.shippingAddress.country,
          phone: doc.shippingAddress.phone ?? undefined,
        }
      : undefined,
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}
