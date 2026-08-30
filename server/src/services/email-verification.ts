import type { UserDocument } from "../models/User.js";
import {
  generateActionTokenSecret,
  hashActionTokenSecret,
  verifyActionTokenSecret,
  buildActionToken,
} from "./action-token.js";

const VERIFICATION_TOKEN_TTL_MS = 15 * 60 * 1000;

export function generateEmailVerificationToken(user: UserDocument): {
  token: string;
  secret: string;
} {
  const secret = generateActionTokenSecret();
  return {
    token: buildActionToken(user._id.toString(), secret),
    secret,
  };
}

export async function setEmailVerificationToken(
  user: UserDocument,
  secret: string
): Promise<void> {
  user.emailVerificationTokenHash = await hashActionTokenSecret(secret);
  user.emailVerificationExpires = new Date(
    Date.now() + VERIFICATION_TOKEN_TTL_MS
  );
}

export async function clearEmailVerificationToken(
  user: UserDocument
): Promise<void> {
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
}

export async function verifyEmailVerificationToken(
  user: UserDocument,
  secret: string
): Promise<boolean> {
  if (!user.emailVerificationTokenHash || !user.emailVerificationExpires) {
    return false;
  }

  if (user.emailVerificationExpires.getTime() < Date.now()) {
    return false;
  }

  return verifyActionTokenSecret(secret, user.emailVerificationTokenHash);
}
