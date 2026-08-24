import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function hashVerificationCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyVerificationCode(
  code: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
