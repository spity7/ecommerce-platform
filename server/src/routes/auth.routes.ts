import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { authRateLimiter } from "../middleware/rateLimit.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import type { UserDocument } from "../models/User.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { toUserDto } from "../utils/serializers.js";
import {
  isRefreshTokenValid,
  toTokenPayload,
} from "../services/auth.tokens.js";
import {
  clearPasswordResetCode,
  generatePasswordResetCode,
  setPasswordResetCode,
  verifyPasswordResetCode,
} from "../services/password-reset.js";
import { sendPasswordResetEmail } from "../services/password-reset-email.js";

export const authRouter = Router();

authRouter.use(authRateLimiter);

function issueAuthTokens(user: UserDocument) {
  const payload = toTokenPayload(user);

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: toUserDto(user),
  };
}

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    res.json(issueAuthTokens(user));
  })
);

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await User.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      phone: payload.phone ?? "",
      role: "customer",
      refreshTokenVersion: 0,
    });

    res.status(201).json(issueAuthTokens(user));
  })
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError(401, "User not found");
    }

    if (!isRefreshTokenValid(payload, user)) {
      throw new AppError(401, "Refresh token has been revoked");
    }

    res.json(issueAuthTokens(user));
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    res.json(toUserDto(user));
  })
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (user) {
      user.refreshTokenVersion = (user.refreshTokenVersion ?? 0) + 1;
      await user.save();
    }
    res.json({ ok: true });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const code = generatePasswordResetCode();
      await setPasswordResetCode(user, code);
      await user.save();

      if (env.mail.isConfigured) {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          code,
          siteName: env.site.name,
        });
      } else if (env.NODE_ENV === "development") {
        console.info(`[password-reset] ${user.email}: ${code}`);
        res.json({ ok: true as const, devResetCode: code });
        return;
      } else {
        console.error(
          `[password-reset] SMTP is not configured; reset code for ${user.email} was not emailed`
        );
      }
    }

    res.json({ ok: true as const });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const { email, code, newPassword } = resetPasswordSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError(400, "Invalid verification code");
    }

    const validCode = await verifyPasswordResetCode(user, code);
    if (!validCode) {
      throw new AppError(400, "Invalid or expired verification code");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.refreshTokenVersion = (user.refreshTokenVersion ?? 0) + 1;
    await clearPasswordResetCode(user);
    await user.save();

    res.json({ ok: true as const });
  })
);
