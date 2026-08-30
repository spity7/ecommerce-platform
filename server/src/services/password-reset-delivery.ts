import { env } from "../config/env.js";
import type { UserDocument } from "../models/User.js";
import {
  generatePasswordResetToken,
  setPasswordResetToken,
} from "./password-reset.js";
import { sendPasswordResetEmail } from "./password-reset-email.js";

function buildPasswordResetUrl(user: UserDocument, token: string): string {
  const baseUrl = (
    user.role === "admin" ? env.site.adminUrl : env.site.url
  ).replace(/\/$/, "");
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function deliverPasswordReset(
  user: UserDocument
): Promise<string | undefined> {
  const { token, secret } = generatePasswordResetToken(user);
  await setPasswordResetToken(user, secret);

  if (env.mail.isConfigured) {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl: buildPasswordResetUrl(user, token),
      siteName: env.site.name,
    });
    return undefined;
  }

  if (env.NODE_ENV === "development") {
    console.info(`[password-reset] ${user.email}: ${token}`);
    return token;
  }

  console.error(
    `[password-reset] SMTP is not configured; reset link for ${user.email} was not emailed`
  );
  return undefined;
}
