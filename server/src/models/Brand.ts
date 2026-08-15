import { Schema, model, type InferSchemaType, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    website: { type: String, default: "" },
    initials: { type: String, default: "" },
    tileClass: { type: String, default: "bg-brand-50 text-brand-600" },
    visibility: {
      type: String,
      enum: ["Featured", "Standard", "Hidden"],
      default: "Standard",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    productCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export type BrandDocument = InferSchemaType<typeof brandSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Brand = model("Brand", brandSchema);
