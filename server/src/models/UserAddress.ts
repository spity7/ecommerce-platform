import { Schema } from "mongoose";

export const userAddressSchema = new Schema(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);
