import type { UserDocument } from "../models/User.js";

export const ACCOUNT_REACTIVATION_MS = 14 * 24 * 60 * 60 * 1000;

export function isAccountDeleted(user: UserDocument): boolean {
  return Boolean(user.deletedAt);
}

export function canReactivateAccount(user: UserDocument): boolean {
  if (!user.deletedAt) {
    return false;
  }

  return Date.now() - user.deletedAt.getTime() <= ACCOUNT_REACTIVATION_MS;
}

export async function reactivateAccount(user: UserDocument): Promise<void> {
  user.deletedAt = undefined;
}
