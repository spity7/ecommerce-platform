import { env } from "../config/env.js";
import type { UserDocument } from "../models/User.js";
import {
  createEmailVerificationCode,
  setEmailVerificationCode,
} from "./email-verification.js";
import { sendEmailVerificationEmail } from "./email-verification-email.js";

export async function deliverEmailVerification(
  user: UserDocument
): Promise<string | undefined> {
  if (user.emailVerified) {
    return undefined;
  }

  const code = createEmailVerificationCode();
  await setEmailVerificationCode(user, code);

  if (env.mail.isConfigured) {
    await sendEmailVerificationEmail({
      to: user.email,
      name: user.name,
      code,
      siteName: env.site.name,
    });
    return undefined;
  }

  if (env.NODE_ENV === "development") {
    console.info(`[email-verification] ${user.email}: ${code}`);
    return code;
  }

  console.error(
    `[email-verification] SMTP is not configured; code for ${user.email} was not emailed`
  );
  return undefined;
}
