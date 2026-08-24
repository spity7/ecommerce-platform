import { sendMail } from "./mail.service.js";

type EmailVerificationInput = {
  to: string;
  name: string;
  code: string;
  siteName: string;
};

export async function sendEmailVerificationEmail(
  input: EmailVerificationInput
): Promise<void> {
  const subject = `${input.siteName} email verification code`;
  const text = [
    `Hi ${input.name},`,
    "",
    `Your email verification code is: ${input.code}`,
    "",
    "This code expires in 15 minutes.",
    "",
    `— ${input.siteName}`,
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>Your email verification code is:</p>
    <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${escapeHtml(
      input.code
    )}</p>
    <p>This code expires in 15 minutes.</p>
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
