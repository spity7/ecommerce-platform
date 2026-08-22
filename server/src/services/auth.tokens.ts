import type { UserDocument } from "../models/User.js";
import type { TokenPayload } from "../utils/jwt.js";

export function toTokenPayload(user: UserDocument): TokenPayload {
  return {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    tokenVersion: user.refreshTokenVersion ?? 0,
  };
}

export function isRefreshTokenValid(
  payload: TokenPayload,
  user: UserDocument
): boolean {
  const version = payload.tokenVersion ?? 0;
  return version === (user.refreshTokenVersion ?? 0);
}
