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
  deleteEmptyGuestCart,
  deleteGuestCartDocument,
  findGuestCart,
  getGuestSessionId,
  getOrCreateUserCart,
  mergeGuestCartIntoUser,
  resolveCartForMutation,
  toEphemeralGuestCartDto,
  updateCartItemQuantity,
} from "../services/cart.service.js";
import { refreshCartLineItems } from "../services/commerce-hygiene.service.js";
import { toCartDto } from "../services/commerce.serializers.js";

export const cartRouter = Router();

cartRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.auth?.userId;
    if (userId) {
      const cart = await getOrCreateUserCart(userId);
      await refreshCartLineItems(cart);
      res.json(toCartDto(cart));
      return;
    }

    const guestSessionId = getGuestSessionId(req);
    if (!guestSessionId) {
      throw new AppError(400, "Guest cart id header is required");
    }

    const cart = await findGuestCart(guestSessionId);
    if (!cart) {
      res.json(toEphemeralGuestCartDto(guestSessionId));
      return;
    }

    await refreshCartLineItems(cart);
    if (await deleteEmptyGuestCart(cart)) {
      res.json(toEphemeralGuestCartDto(guestSessionId));
      return;
    }

    res.json(toCartDto(cart));
  })
);

cartRouter.post(
  "/items",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = cartItemInputSchema.parse(req.body);
    const cart = await resolveCartForMutation(req);
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
    const cart = await resolveCartForMutation(req);
    const itemId = String(req.params.itemId);
    const dto = await updateCartItemQuantity(cart, itemId, quantity);
    res.json(dto);
  })
);

cartRouter.delete(
  "/items/:itemId",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const guestSessionId = getGuestSessionId(req);
    const userId = req.auth?.userId;
    let cart = userId
      ? await getOrCreateUserCart(userId)
      : guestSessionId
        ? await findGuestCart(guestSessionId)
        : null;

    if (!cart) {
      if (!guestSessionId && !userId) {
        throw new AppError(400, "Guest cart id header is required");
      }
      throw new AppError(404, "Cart not found");
    }

    const itemId = String(req.params.itemId);
    const index = cart.items.findIndex(
      (entry) => entry._id.toString() === itemId
    );
    if (index === -1) {
      throw new AppError(404, "Cart item not found");
    }
    cart.items.splice(index, 1);

    if (cart.guestSessionId && cart.items.length === 0) {
      await deleteGuestCartDocument(cart);
      res.json(toEphemeralGuestCartDto(cart.guestSessionId));
      return;
    }

    await cart.save();
    res.json(toCartDto(cart));
  })
);

cartRouter.delete(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const userId = req.auth?.userId;
    if (userId) {
      const cart = await getOrCreateUserCart(userId);
      cart.set("items", []);
      await cart.save();
      res.json(toCartDto(cart));
      return;
    }

    const guestSessionId = getGuestSessionId(req);
    if (!guestSessionId) {
      throw new AppError(400, "Guest cart id header is required");
    }

    const cart = await findGuestCart(guestSessionId);
    if (!cart) {
      res.json(toEphemeralGuestCartDto(guestSessionId));
      return;
    }

    await deleteGuestCartDocument(cart);
    res.json(toEphemeralGuestCartDto(guestSessionId));
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
