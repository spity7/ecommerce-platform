import type { CreateOrderInput } from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { getOrCreateUserCart } from "./cart.service.js";
import { syncVerifiedPurchaseForOrder } from "./review.service.js";
import type { OrderStatus } from "@platform/shared";

type PlaceOrderContext = {
  userId: string;
  role: string;
};

const CUSTOMER_CANCELLABLE_STATUSES = new Set(["pending", "processing"]);

async function clampProductUnitsSoldNonNegative(
  productId: unknown
): Promise<void> {
  await Product.updateOne(
    { _id: productId, unitsSold: { $lt: 0 } },
    { $set: { unitsSold: 0 } }
  );
}

function shouldRefreshVerifiedPurchaseOnStatusChange(
  previousStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  if (previousStatus === nextStatus) {
    return false;
  }
  return nextStatus === "cancelled" || previousStatus === "cancelled";
}

async function decrementStockWithRollback(
  items: Array<{ productId: unknown; quantity: number; productName: string }>
): Promise<void> {
  const decremented: Array<{ productId: unknown; quantity: number }> = [];

  try {
    for (const item of items) {
      const result = await Product.updateOne(
        {
          _id: item.productId,
          status: "published",
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity, unitsSold: item.quantity } }
      );

      if (result.modifiedCount === 0) {
        throw new AppError(400, `Insufficient stock for ${item.productName}`);
      }

      decremented.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  } catch (error) {
    for (const entry of decremented) {
      await Product.updateOne(
        { _id: entry.productId },
        { $inc: { stock: entry.quantity, unitsSold: -entry.quantity } }
      );
      await clampProductUnitsSoldNonNegative(entry.productId);
    }
    throw error;
  }
}

export async function restoreOrderStock(
  items: Array<{ productId: unknown; quantity: number }>
): Promise<void> {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity, unitsSold: -item.quantity } }
    );
    await clampProductUnitsSoldNonNegative(item.productId);
  }
}

export async function placeOrderFromCart(
  context: PlaceOrderContext,
  payload: CreateOrderInput
) {
  const cart = await getOrCreateUserCart(context.userId);

  if (cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  const user = await User.findById(context.userId);
  if (!user || user.deletedAt) {
    throw new AppError(404, "User not found");
  }

  if (context.role !== "admin" && !user.emailVerified) {
    throw new AppError(403, "Verify your email before placing an order");
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product || product.status !== "published") {
      throw new AppError(400, `Product ${item.productName} is unavailable`);
    }
  }

  const items = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    productName: item.productName,
    productSlug: item.productSlug,
    productImage: item.productImage,
    price: item.price,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  await decrementStockWithRollback(cart.items);

  let order;
  try {
    order = await Order.create({
      userId: context.userId,
      status: "pending",
      items,
      subtotal,
      total: subtotal,
      shippingAddress: payload.shippingAddress,
    });

    cart.set("items", []);
    await cart.save();
  } catch (error) {
    await restoreOrderStock(cart.items);

    if (order) {
      await Order.deleteOne({ _id: order._id });
    }

    throw error;
  }

  await syncVerifiedPurchaseForOrder(order);

  return { order, user };
}

export async function cancelOrderForCustomer(orderId: string, userId: string) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.userId.toString() !== userId) {
    throw new AppError(403, "Forbidden");
  }

  if (!CUSTOMER_CANCELLABLE_STATUSES.has(order.status)) {
    throw new AppError(
      400,
      "This order can no longer be cancelled because it has already shipped."
    );
  }

  const previousStatus = order.status;
  order.status = "cancelled";
  await order.save();

  if (previousStatus !== "cancelled") {
    await restoreOrderStock(order.items);
  }

  await syncVerifiedPurchaseForOrder(order);

  return order;
}

export async function updateOrderStatusByAdmin(
  orderId: string,
  status: OrderStatus
) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  const previousStatus = order.status;
  order.status = status;

  if (
    status === "cancelled" &&
    previousStatus !== "cancelled" &&
    previousStatus !== "delivered"
  ) {
    await restoreOrderStock(order.items);
  }

  await order.save();

  if (shouldRefreshVerifiedPurchaseOnStatusChange(previousStatus, status)) {
    await syncVerifiedPurchaseForOrder(order);
  }

  return order;
}
