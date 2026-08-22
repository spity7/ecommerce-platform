import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  changePasswordSchema,
  createUserAddressSchema,
  updateUserAddressSchema,
  updateUserProfileSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import {
  addUserAddress,
  findUserAddress,
  removeUserAddress,
  setDefaultAddress,
} from "../services/user-addresses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toUserAddressDto, toUserDto } from "../utils/serializers.js";

export const usersRouter = Router();

usersRouter.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = updateUserProfileSchema.parse(req.body);
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (payload.name !== undefined) {
      user.name = payload.name;
    }
    if (payload.phone !== undefined) {
      user.phone = payload.phone;
    }

    await user.save();
    res.json(toUserDto(user));
  })
);

usersRouter.patch(
  "/me/password",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );
    const user = await User.findById(req.auth?.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Current password is incorrect");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.refreshTokenVersion = (user.refreshTokenVersion ?? 0) + 1;
    user.passwordResetCodeHash = undefined;
    user.passwordResetExpires = undefined;
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
