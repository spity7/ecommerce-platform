import { Router } from "express";
import { updateUserProfileSchema } from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toUserDto } from "../utils/serializers.js";

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
