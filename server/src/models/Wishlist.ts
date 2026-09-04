import mongoose, { Schema, type InferSchemaType } from "mongoose";

const wishlistItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    productImage: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const wishlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

export type WishlistDocument = InferSchemaType<typeof wishlistSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type WishlistItemDocument = InferSchemaType<typeof wishlistItemSchema>;

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
