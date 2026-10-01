import mongoose, { Schema, type InferSchemaType, Types } from "mongoose";
import { applyGuestCartExpiry } from "../services/cart-guest-retention.js";

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    guestSessionId: { type: String, unique: true, sparse: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

cartSchema.pre("save", function applyGuestCartTtl() {
  if (this.guestSessionId) {
    applyGuestCartExpiry(this as CartDocument);
  }
});

cartSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { guestSessionId: { $type: "string" } },
  }
);

export type CartDocument = mongoose.HydratedDocument<
  InferSchemaType<typeof cartSchema>
>;

export type CartItemDocument = InferSchemaType<typeof cartItemSchema> & {
  _id: Types.ObjectId;
};

export const Cart = mongoose.model("Cart", cartSchema);
