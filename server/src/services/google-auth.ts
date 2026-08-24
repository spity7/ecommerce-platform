import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

export type GoogleProfile = {
  email: string;
  name: string;
  sub: string;
  picture?: string;
};

function parseTestGoogleToken(idToken: string): GoogleProfile | null {
  if (env.NODE_ENV === "production") {
    return null;
  }

  if (!idToken.startsWith("test-google|")) {
    return null;
  }

  const parts = idToken.split("|");
  if (parts.length < 3) {
    return null;
  }

  const email = parts[1]?.toLowerCase() ?? "";
  const sub = parts[2] ?? "";
  if (!email.includes("@") || !sub) {
    return null;
  }

  const picture = parts[3] || undefined;

  return {
    email,
    name: "Google Test User",
    sub,
    picture,
  };
}

export async function verifyGoogleIdToken(
  idToken: string
): Promise<GoogleProfile> {
  const testProfile = parseTestGoogleToken(idToken);
  if (testProfile) {
    return testProfile;
  }

  if (!env.google.isConfigured) {
    throw new AppError(503, "Google sign-in is not configured");
  }

  const client = new OAuth2Client(env.google.clientId);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.google.clientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub) {
    throw new AppError(401, "Invalid Google token");
  }

  return {
    email: payload.email.toLowerCase(),
    name: payload.name?.trim() || payload.email,
    sub: payload.sub,
    picture: payload.picture,
  };
}
