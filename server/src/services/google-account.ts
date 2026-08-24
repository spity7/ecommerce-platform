import { AppError } from "../middleware/errorHandler.js";
import type { UserDocument } from "../models/User.js";
import { verifyGoogleIdToken, type GoogleProfile } from "./google-auth.js";

export function userHasPassword(user: UserDocument): boolean {
  return user.passwordSetByUser ?? true;
}

export async function verifyGoogleIdTokenForUser(
  user: UserDocument,
  idToken: string
): Promise<GoogleProfile> {
  const profile = await verifyGoogleIdToken(idToken);

  if (user.oauthProvider !== "google" || user.oauthId !== profile.sub) {
    throw new AppError(401, "Google account does not match this user");
  }

  if (profile.email !== user.email.toLowerCase()) {
    throw new AppError(401, "Google account does not match this user");
  }

  return profile;
}

export function applyGoogleAvatar(user: UserDocument, picture?: string): void {
  if (picture && !user.avatarUrl) {
    user.avatarUrl = picture;
  }
}
