import mongoose, { Schema, type InferSchemaType } from "mongoose";
import type { UserRole } from "@platform/shared";

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
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = mongoose.model("User", userSchema);
