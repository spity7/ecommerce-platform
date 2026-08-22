import { getSiteConfig } from "@platform/site-config";
import { z } from "zod";

const DEV_JWT_ACCESS_SECRET = "dev-access-secret-change-me";
const DEV_JWT_REFRESH_SECRET = "dev-refresh-secret-change-me";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SITE_ID: z.string().min(1).default("beauty-station"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://localhost:3001"),
  GCS_PROJECT_ID: z.string().optional(),
  GCS_BUCKET_NAME: z.string().optional(),
  GCS_KEY_FILE: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev-access-secret-change-me"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default("dev-refresh-secret-change-me"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z
    .enum(["true", "false", "1", "0"])
    .optional()
    .transform((value) => value === "true" || value === "1"),
  EMAIL_FROM: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

const data = parsed.data;

if (data.NODE_ENV === "production") {
  if (
    data.JWT_ACCESS_SECRET === DEV_JWT_ACCESS_SECRET ||
    data.JWT_REFRESH_SECRET === DEV_JWT_REFRESH_SECRET
  ) {
    console.error(
      "Invalid environment variables: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set to non-default values in production."
    );
    process.exit(1);
  }
}

const site = getSiteConfig(data.SITE_ID);

export const env = {
  ...data,
  site,
  corsOrigins: data.CORS_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  gcs: {
    projectId: data.GCS_PROJECT_ID,
    bucketName: data.GCS_BUCKET_NAME,
    keyFile: data.GCS_KEY_FILE,
    isConfigured: Boolean(
      data.GCS_PROJECT_ID && data.GCS_BUCKET_NAME && data.GCS_KEY_FILE
    ),
  },
  jwt: {
    accessSecret: data.JWT_ACCESS_SECRET,
    refreshSecret: data.JWT_REFRESH_SECRET,
    accessExpiresIn: data.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: data.JWT_REFRESH_EXPIRES_IN,
  },
  mail: {
    host: data.SMTP_HOST,
    port: data.SMTP_PORT,
    user: data.SMTP_USER,
    pass: data.SMTP_PASS,
    secure: data.SMTP_SECURE ?? false,
    from: data.EMAIL_FROM ?? site.contact.email,
    isConfigured: Boolean(data.SMTP_HOST),
  },
} as const;
