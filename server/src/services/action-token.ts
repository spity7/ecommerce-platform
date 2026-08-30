import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export function isValidObjectId(value: string): boolean {
  return (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  );
}

export function generateActionTokenSecret(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function buildActionToken(userId: string, secret: string): string {
  return `${userId}.${secret}`;
}

export function parseActionToken(
  token: string
): { userId: string; secret: string } | null {
  const separatorIndex = token.indexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return null;
  }

  const userId = token.slice(0, separatorIndex);
  const secret = token.slice(separatorIndex + 1);
  if (!userId || !secret) {
    return null;
  }

  return { userId, secret };
}

export async function hashActionTokenSecret(secret: string): Promise<string> {
  return bcrypt.hash(secret, 10);
}

export async function verifyActionTokenSecret(
  secret: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(secret, hash);
}
