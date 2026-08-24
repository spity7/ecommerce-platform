import type { UserDocument } from "../models/User.js";
import {
  generateVerificationCode,
  hashVerificationCode,
  verifyVerificationCode,
} from "./verification-code.js";

export function generatePasswordResetCode(): string {
  return generateVerificationCode();
}

export async function setPasswordResetCode(
  user: UserDocument,
  code: string
): Promise<void> {
  user.passwordResetCodeHash = await hashVerificationCode(code);
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

  return verifyVerificationCode(code, user.passwordResetCodeHash);
}
