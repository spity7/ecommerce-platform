import mongoose, { Schema, type InferSchemaType, Types } from "mongoose";

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
  },
  { timestamps: true }
);

export type CartDocument = InferSchemaType<typeof cartSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type CartItemDocument = InferSchemaType<typeof cartItemSchema> & {
  _id: Types.ObjectId;
};

export const Cart = mongoose.model("Cart", cartSchema);
