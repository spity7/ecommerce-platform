import type { UserDocument } from "../models/User.js";
import {
  generateActionTokenSecret,
  hashActionTokenSecret,
  verifyActionTokenSecret,
  buildActionToken,
} from "./action-token.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export function generatePasswordResetToken(user: UserDocument): {
  token: string;
  secret: string;
} {
  const secret = generateActionTokenSecret();
  return {
    token: buildActionToken(user._id.toString(), secret),
    secret,
  };
}

export async function setPasswordResetToken(
  user: UserDocument,
  secret: string
): Promise<void> {
  user.passwordResetTokenHash = await hashActionTokenSecret(secret);
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
}

export async function clearPasswordResetToken(
  user: UserDocument
): Promise<void> {
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
}

export async function verifyPasswordResetToken(
  user: UserDocument,
  secret: string
): Promise<boolean> {
  if (!user.passwordResetTokenHash || !user.passwordResetExpires) {
    return false;
  }

  if (user.passwordResetExpires.getTime() < Date.now()) {
    return false;
  }

  return verifyActionTokenSecret(secret, user.passwordResetTokenHash);
}
