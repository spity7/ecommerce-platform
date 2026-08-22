import { sendMail } from "./mail.service.js";

type PasswordResetEmailInput = {
  to: string;
  name: string;
  code: string;
  siteName: string;
};

export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput
): Promise<void> {
  const subject = `${input.siteName} password reset code`;
  const text = [
    `Hi ${input.name},`,
    "",
    `Your password reset code is: ${input.code}`,
    "",
    "This code expires in 15 minutes. If you did not request a reset, you can ignore this email.",
    "",
    `— ${input.siteName}`,
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>Your password reset code is:</p>
    <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${escapeHtml(
      input.code
    )}</p>
    <p>This code expires in 15 minutes.</p>
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
