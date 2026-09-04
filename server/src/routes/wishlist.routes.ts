import { Router } from "express";
import {
  moveWishlistItemSchema,
  wishlistItemInputSchema,
} from "@platform/shared";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addProductToWishlist,
  clearUserWishlist,
  getUserWishlist,
  moveWishlistItemToCart,
  removeProductFromWishlist,
} from "../services/wishlist.service.js";

export const wishlistRouter = Router();

wishlistRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const wishlist = await getUserWishlist(req.auth!.userId);
    res.json(wishlist);
  })
);

wishlistRouter.post(
  "/items",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = wishlistItemInputSchema.parse(req.body);
    const wishlist = await addProductToWishlist(
      req.auth!.userId,
      payload.productId
    );
    res.status(201).json(wishlist);
  })
);

wishlistRouter.delete(
  "/items/:productId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const productId = String(req.params.productId);
    const wishlist = await removeProductFromWishlist(
      req.auth!.userId,
      productId
    );
    res.json(wishlist);
  })
);

wishlistRouter.delete(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const wishlist = await clearUserWishlist(req.auth!.userId);
    res.json(wishlist);
  })
);

wishlistRouter.post(
  "/move-to-cart",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = moveWishlistItemSchema.parse(req.body);
    const result = await moveWishlistItemToCart(
      req.auth!.userId,
      payload.productId,
      payload.quantity ?? 1
    );
    res.json(result);
  })
);
