import { z } from "../zod.js";
import { USER_ROLES } from "../types/auth.js";
import { isStrongPassword, STRONG_PASSWORD_MESSAGE } from "../password.js";

const strongPasswordSchema = z
  .string()
  .min(8)
  .refine(isStrongPassword, STRONG_PASSWORD_MESSAGE);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).optional(),
    newPassword: strongPasswordSchema,
    idToken: z.string().min(1).optional(),
  })
  .refine(
    (data) => data.currentPassword || data.idToken,
    "Current password or Google confirmation is required"
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: strongPasswordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const deleteAccountSchema = z
  .object({
    password: z.string().min(1).optional(),
    idToken: z.string().min(1).optional(),
  })
  .refine(
    (data) => data.password || data.idToken,
    "Password or Google confirmation is required"
  );

export const socialAuthSchema = z.object({
  provider: z.enum(["google"]),
  idToken: z.string().min(1),
});

export const okResponseSchema = z.object({
  ok: z.literal(true),
  devResetToken: z.string().optional(),
  devVerificationToken: z.string().optional(),
});

export const userDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  emailVerified: z.boolean(),
  passwordSetByUser: z.boolean(),
  oauthProvider: z.enum(["google"]).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userDtoSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type SocialAuthInput = z.infer<typeof socialAuthSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
