import type { OrderDocument } from "../models/Order.js";
import type { UserDocument } from "../models/User.js";

export function getOrderUserId(order: OrderDocument): string {
  const userId = order.userId as unknown;

  if (
    userId &&
    typeof userId === "object" &&
    "_id" in userId &&
    typeof (userId as { _id: { toString(): string } })._id?.toString ===
      "function"
  ) {
    return (userId as { _id: { toString(): string } })._id.toString();
  }

  return order.userId.toString();
}

export function getOrderCustomer(
  order: OrderDocument
): { name: string; email: string } | undefined {
  const populated = order.userId as unknown;

  if (
    populated &&
    typeof populated === "object" &&
    "name" in populated &&
    "email" in populated &&
    "_id" in populated
  ) {
    const user = populated as UserDocument;
    return { name: user.name, email: user.email };
  }

  return undefined;
}
