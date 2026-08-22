import { getMailTransporter } from "../config/mail.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendMail(input: SendMailInput): Promise<void> {
  if (!env.mail.isConfigured) {
    throw new AppError(503, "Email delivery is not configured.");
  }

  const transporter = getMailTransporter();

  await transporter.sendMail({
    from: env.mail.from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}
