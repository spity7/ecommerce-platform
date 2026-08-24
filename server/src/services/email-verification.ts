import type { UserDocument } from "../models/User.js";
import {
  generateVerificationCode,
  hashVerificationCode,
  verifyVerificationCode,
} from "./verification-code.js";

export async function setEmailVerificationCode(
  user: UserDocument,
  code: string
): Promise<void> {
  user.emailVerificationCodeHash = await hashVerificationCode(code);
  user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
}

export async function clearEmailVerificationCode(
  user: UserDocument
): Promise<void> {
  user.emailVerificationCodeHash = undefined;
  user.emailVerificationExpires = undefined;
}

export async function verifyEmailVerificationCode(
  user: UserDocument,
  code: string
): Promise<boolean> {
  if (!user.emailVerificationCodeHash || !user.emailVerificationExpires) {
    return false;
  }

  if (user.emailVerificationExpires.getTime() < Date.now()) {
    return false;
  }

  return verifyVerificationCode(code, user.emailVerificationCodeHash);
}

export function createEmailVerificationCode(): string {
  return generateVerificationCode();
}
