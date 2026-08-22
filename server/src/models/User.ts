import mongoose, { Schema, type InferSchemaType, type Types } from "mongoose";
import type { UserRole } from "@platform/shared";
import { userAddressSchema } from "./UserAddress.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer"] satisfies UserRole[],
      default: "customer",
    },
    phone: { type: String, default: "" },
    refreshTokenVersion: { type: Number, default: 0, min: 0 },
    passwordResetCodeHash: { type: String },
    passwordResetExpires: { type: Date },
    addresses: [userAddressSchema],
  },
  { timestamps: true }
);

export type UserAddressSubdocument = InferSchemaType<
  typeof userAddressSchema
> & {
  _id: Types.ObjectId;
};

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  addresses: Types.DocumentArray<UserAddressSubdocument>;
};

export const User = mongoose.model("User", userSchema);
