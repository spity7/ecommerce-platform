import { sendMail } from "./mail.service.js";
import { escapeHtml, renderActionEmailButton } from "./email-html.js";

type PasswordResetEmailInput = {
  to: string;
  name: string;
  resetUrl: string;
  siteName: string;
};

export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput
): Promise<void> {
  const subject = `${input.siteName} password reset`;
  const text = [
    `Hi ${input.name},`,
    "",
    "We received a request to reset your password.",
    "",
    `Reset your password: ${input.resetUrl}`,
    "",
    "This link expires in 15 minutes. If you did not request a reset, you can ignore this email.",
    "",
    `— ${input.siteName}`,
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>We received a request to reset your password.</p>
    ${renderActionEmailButton({
      href: input.resetUrl,
      label: "Reset password",
    })}
    <p>This link expires in 15 minutes.</p>
    <p>If you did not request a reset, you can ignore this email.</p>
    <p>— ${escapeHtml(input.siteName)}</p>
  `.trim();

  await sendMail({
    to: input.to,
    subject,
    text,
    html,
  });
}
