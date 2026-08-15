import { Schema, model, type InferSchemaType, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    categoryName: { type: String, default: "" },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
    brandName: { type: String, default: "" },
    images: { type: [String], default: [] },
    attributes: { type: Schema.Types.Mixed, default: {} },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", sku: "text", description: "text" });
productSchema.index({ status: 1, createdAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Product = model("Product", productSchema);
