import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { User } from "../models/User.js";

const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";
const DEFAULT_ADMIN_NAME = "Admin";

function resolveAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
  return email.toLowerCase();
}

function resolveAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

function resolveAdminName(): string {
  return process.env.ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;
}

async function seedAdmin() {
  const email = resolveAdminEmail();
  const password = resolveAdminPassword();
  const name = resolveAdminName();

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    existing.emailVerified = true;
    existing.passwordSetByUser = true;
    existing.deletedAt = undefined;
    existing.refreshTokenVersion = (existing.refreshTokenVersion ?? 0) + 1;
    await existing.save();
    console.log(`Updated admin user: ${email}`);
  } else {
    await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
      emailVerified: true,
      passwordSetByUser: true,
    });
    console.log(`Created admin user: ${email}`);
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `Using default dev password for ${email}. Set ADMIN_PASSWORD in server/.env for production.`
    );
  }

  await disconnectDatabase();
}

seedAdmin().catch(async (error) => {
  console.error("Admin seed failed:", error);
  await disconnectDatabase();
  process.exit(1);
});
