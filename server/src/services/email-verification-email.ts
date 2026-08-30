import { sendMail } from "./mail.service.js";
import { escapeHtml, renderActionEmailButton } from "./email-html.js";

type EmailVerificationInput = {
  to: string;
  name: string;
  verifyUrl: string;
  siteName: string;
};

export async function sendEmailVerificationEmail(
  input: EmailVerificationInput
): Promise<void> {
  const subject = `${input.siteName} verify your email`;
  const text = [
    `Hi ${input.name},`,
    "",
    "Please verify your email address to secure your account and receive order updates.",
    "",
    `Verify your email: ${input.verifyUrl}`,
    "",
    "This link expires in 15 minutes.",
    "",
    `— ${input.siteName}`,
  ].join("\n");

  const html = `
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>Please verify your email address to secure your account and receive order updates.</p>
    ${renderActionEmailButton({
      href: input.verifyUrl,
      label: "Verify email",
    })}
    <p>This link expires in 15 minutes.</p>
    <p>— ${escapeHtml(input.siteName)}</p>
  `.trim();

  await sendMail({
    to: input.to,
    subject,
    text,
    html,
  });
}
