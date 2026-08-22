import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env.js";

let transporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  if (!env.mail.isConfigured) {
    throw new Error("SMTP is not configured.");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.secure,
      auth:
        env.mail.user && env.mail.pass
          ? { user: env.mail.user, pass: env.mail.pass }
          : undefined,
    });
  }

  return transporter;
}
