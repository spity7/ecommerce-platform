import { Router } from "express";
import {
  createReviewSchema,
  updateReviewSchema,
} from "@platform/shared";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js";
import { reviewWriteRateLimiter } from "../middleware/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteOwnReview,
  listReviewsForUser,
  updateOwnReview,
} from "../services/review.service.js";

export const reviewsRouter = Router();

reviewsRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = await listReviewsForUser(req.auth!.userId);
    res.json(result);
  })
);

reviewsRouter.patch(
  "/:id",
  requireAuth,
  reviewWriteRateLimiter,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = updateReviewSchema.parse(req.body);
    const review = await updateOwnReview(
      req.auth!.userId,
      String(req.params.id),
      payload
    );
    res.json(review);
  })
);

reviewsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await deleteOwnReview(req.auth!.userId, String(req.params.id));
    res.status(204).send();
  })
);
