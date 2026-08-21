import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { ORDER_STATUSES } from "@platform/shared";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shippingAddress: { type: shippingAddressSchema, required: false },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Order = mongoose.model("Order", orderSchema);
