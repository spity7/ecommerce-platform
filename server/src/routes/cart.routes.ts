import { Router } from "express";
import {
  cartItemInputSchema,
  mergeCartSchema,
  updateCartItemSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import {
  optionalAuth,
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addProductToCart,
  mergeGuestCartIntoUser,
  resolveCart,
} from "../services/cart.service.js";
import { toCartDto } from "../services/commerce.serializers.js";

export const cartRouter = Router();

cartRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cart = await resolveCart(req);
    res.json(toCartDto(cart));
  })
);

cartRouter.post(
  "/items",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = cartItemInputSchema.parse(req.body);
    const cart = await resolveCart(req);
    const dto = await addProductToCart(
      cart,
      payload.productId,
      payload.quantity
    );
    res.status(201).json(dto);
  })
);

cartRouter.patch(
  "/items/:itemId",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { quantity } = updateCartItemSchema.parse(req.body);
    const cart = await resolveCart(req);
    const item = cart.items.find(
      (entry) => entry._id.toString() === req.params.itemId
    );
    if (!item) {
      throw new AppError(404, "Cart item not found");
    }
    item.quantity = quantity;
    await cart.save();
    res.json(toCartDto(cart));
  })
);

cartRouter.delete(
  "/items/:itemId",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cart = await resolveCart(req);
    const index = cart.items.findIndex(
      (entry) => entry._id.toString() === req.params.itemId
    );
    if (index === -1) {
      throw new AppError(404, "Cart item not found");
    }
    cart.items.splice(index, 1);
    await cart.save();
    res.json(toCartDto(cart));
  })
);

cartRouter.delete(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const cart = await resolveCart(req);
    cart.set("items", []);
    await cart.save();
    res.json(toCartDto(cart));
  })
);

cartRouter.post(
  "/merge",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { guestSessionId } = mergeCartSchema.parse(req.body);
    const dto = await mergeGuestCartIntoUser(req.auth!.userId, guestSessionId);
    res.json(dto);
  })
);
