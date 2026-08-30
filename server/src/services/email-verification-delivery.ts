import { env } from "../config/env.js";
import type { UserDocument } from "../models/User.js";
import {
  generateEmailVerificationToken,
  setEmailVerificationToken,
} from "./email-verification.js";
import { sendEmailVerificationEmail } from "./email-verification-email.js";

function buildEmailVerificationUrl(token: string): string {
  const baseUrl = env.site.url.replace(/\/$/, "");
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
}

export async function deliverEmailVerification(
  user: UserDocument
): Promise<string | undefined> {
  if (user.emailVerified) {
    return undefined;
  }

  const { token, secret } = generateEmailVerificationToken(user);
  await setEmailVerificationToken(user, secret);

  if (env.mail.isConfigured) {
    await sendEmailVerificationEmail({
      to: user.email,
      name: user.name,
      verifyUrl: buildEmailVerificationUrl(token),
      siteName: env.site.name,
    });
    return undefined;
  }

  if (env.NODE_ENV === "development") {
    console.info(`[email-verification] ${user.email}: ${token}`);
    return token;
  }

  console.error(
    `[email-verification] SMTP is not configured; verification link for ${user.email} was not emailed`
  );
  return undefined;
}
