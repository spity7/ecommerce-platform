import { Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import {
  changePasswordSchema,
  createUserAddressSchema,
  deleteAccountSchema,
  updateUserAddressSchema,
  updateUserProfileSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import {
  AVATAR_MAX_BYTES,
  uploadUserAvatar,
} from "../services/avatar-upload.js";
import { deleteManagedAvatarIfPresent } from "../services/managed-avatar-storage.js";
import {
  addUserAddress,
  findUserAddress,
  removeUserAddress,
  setDefaultAddress,
} from "../services/user-addresses.js";
import { clearPasswordResetToken } from "../services/password-reset.js";
import { clearEmailVerificationToken } from "../services/email-verification.js";
import {
  userHasPassword,
  verifyGoogleIdTokenForUser,
} from "../services/google-account.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toUserAddressDto, toUserDto } from "../utils/serializers.js";

export const usersRouter = Router();

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AVATAR_MAX_BYTES },
});

usersRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user || user.deletedAt) {
      throw new AppError(404, "User not found");
    }

    res.json(toUserDto(user));
  })
);

usersRouter.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = updateUserProfileSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user || user.deletedAt) {
      throw new AppError(404, "User not found");
    }

    if (payload.name !== undefined) {
      user.name = payload.name;
    }
    if (payload.phone !== undefined) {
      user.phone = payload.phone;
    }

    const previousAvatarUrl =
      payload.avatarUrl !== undefined ? user.avatarUrl : undefined;

    if (payload.avatarUrl !== undefined) {
      user.avatarUrl = payload.avatarUrl;
    }

    await user.save();

    if (
      payload.avatarUrl !== undefined &&
      payload.avatarUrl !== previousAvatarUrl
    ) {
      await deleteManagedAvatarIfPresent(
        previousAvatarUrl,
        user._id.toString()
      );
    }

    res.json(toUserDto(user));
  })
);

usersRouter.post(
  "/me/avatar",
  requireAuth,
  avatarUpload.single("file"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user || user.deletedAt) {
      throw new AppError(404, "User not found");
    }

    if (!req.file) {
      throw new AppError(
        400,
        "No profile photo was uploaded. Use field name 'file'."
      );
    }

    const previousAvatarUrl = user.avatarUrl;

    const uploaded = await uploadUserAvatar({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      userId: user._id.toString(),
    });

    user.avatarUrl = uploaded.publicUrl;
    await user.save();

    await deleteManagedAvatarIfPresent(previousAvatarUrl, user._id.toString());

    res.status(201).json(toUserDto(user));
  })
);

usersRouter.delete(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { password, idToken } = deleteAccountSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user || user.deletedAt) {
      throw new AppError(404, "User not found");
    }

    if (user.role === "admin") {
      throw new AppError(
        403,
        "Admin accounts cannot be deleted from the storefront"
      );
    }

    if (password) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        throw new AppError(401, "Password is incorrect");
      }
    } else if (idToken) {
      await verifyGoogleIdTokenForUser(user, idToken);
    } else if (!userHasPassword(user)) {
      throw new AppError(400, "Google confirmation is required");
    } else {
      throw new AppError(400, "Password is required");
    }

    user.deletedAt = new Date();
    user.refreshTokenVersion = (user.refreshTokenVersion ?? 0) + 1;
    await clearPasswordResetToken(user);
    await clearEmailVerificationToken(user);
    await user.save();

    res.json({ ok: true as const });
  })
);

usersRouter.patch(
  "/me/password",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { currentPassword, newPassword, idToken } =
      changePasswordSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (userHasPassword(user)) {
      if (!currentPassword) {
        throw new AppError(400, "Current password is required");
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        throw new AppError(401, "Current password is incorrect");
      }
    } else if (idToken) {
      await verifyGoogleIdTokenForUser(user, idToken);
    } else {
      throw new AppError(
        400,
        "Google confirmation is required to set a password"
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordSetByUser = true;
    user.refreshTokenVersion = (user.refreshTokenVersion ?? 0) + 1;
    await clearPasswordResetToken(user);
    await user.save();

    res.json({ ok: true as const });
  })
);

usersRouter.get(
  "/me/addresses",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const addresses = (user.addresses ?? []).map(toUserAddressDto);
    res.json(addresses);
  })
);

usersRouter.post(
  "/me/addresses",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = createUserAddressSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const addressId = addUserAddress(user, payload);
    await user.save();

    const created = findUserAddress(user, addressId.toString());
    if (!created) {
      throw new AppError(500, "Could not create address");
    }

    res.status(201).json(toUserAddressDto(created));
  })
);

usersRouter.patch(
  "/me/addresses/:addressId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = updateUserAddressSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const addressId = String(req.params.addressId);
    const address = findUserAddress(user, addressId);
    if (!address) {
      throw new AppError(404, "Address not found");
    }

    if (payload.name !== undefined) {
      address.name = payload.name;
    }
    if (payload.line1 !== undefined) {
      address.line1 = payload.line1;
    }
    if (payload.line2 !== undefined) {
      address.line2 = payload.line2;
    }
    if (payload.city !== undefined) {
      address.city = payload.city;
    }
    if (payload.country !== undefined) {
      address.country = payload.country;
    }
    if (payload.phone !== undefined) {
      address.phone = payload.phone;
    }
    if (payload.isDefault === true) {
      setDefaultAddress(user, addressId);
    }

    await user.save();
    res.json(toUserAddressDto(address));
  })
);

usersRouter.delete(
  "/me/addresses/:addressId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const removed = removeUserAddress(user, String(req.params.addressId));
    if (!removed) {
      throw new AppError(404, "Address not found");
    }

    await user.save();
    res.json({ ok: true as const });
  })
);

usersRouter.patch(
  "/me/addresses/:addressId/default",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const address = setDefaultAddress(user, String(req.params.addressId));
    if (!address) {
      throw new AppError(404, "Address not found");
    }

    await user.save();
    res.json(toUserAddressDto(address));
  })
);
