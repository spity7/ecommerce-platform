import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { UserDocument } from "../models/User.js";

export function generatePasswordResetCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function setPasswordResetCode(
  user: UserDocument,
  code: string
): Promise<void> {
  user.passwordResetCodeHash = await bcrypt.hash(code, 10);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
}

export async function clearPasswordResetCode(
  user: UserDocument
): Promise<void> {
  user.passwordResetCodeHash = undefined;
  user.passwordResetExpires = undefined;
}

export async function verifyPasswordResetCode(
  user: UserDocument,
  code: string
): Promise<boolean> {
  if (!user.passwordResetCodeHash || !user.passwordResetExpires) {
    return false;
  }

  if (user.passwordResetExpires.getTime() < Date.now()) {
    return false;
  }

  return bcrypt.compare(code, user.passwordResetCodeHash);
}
