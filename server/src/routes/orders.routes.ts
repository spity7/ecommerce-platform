import { Router } from "express";
import {
  createOrderSchema,
  listQuerySchema,
  updateOrderStatusSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import {
  requireAuth,
  requireAdmin,
  type AuthenticatedRequest,
} from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOrCreateUserCart } from "../services/cart.service.js";
import { toOrderDto } from "../services/commerce.serializers.js";
import {
  getOrderCustomer,
  getOrderUserId,
} from "../services/order-customer.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = createOrderSchema.parse(req.body);
    const cart = await getOrCreateUserCart(req.auth!.userId);

    if (cart.items.length === 0) {
      throw new AppError(400, "Cart is empty");
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== "published") {
        throw new AppError(400, `Product ${item.productName} is unavailable`);
      }
      if (product.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for ${item.productName}`);
      }
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      productName: item.productName,
      productSlug: item.productSlug,
      productImage: item.productImage,
      price: item.price,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = await Order.create({
      userId: req.auth!.userId,
      status: "pending",
      items,
      subtotal,
      total: subtotal,
      shippingAddress: payload.shippingAddress,
    });

    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } }
      );
    }

    cart.set("items", []);
    await cart.save();

    const user = await User.findById(req.auth!.userId);
    res
      .status(201)
      .json(
        toOrderDto(
          order,
          user ? { name: user.name, email: user.email } : undefined
        )
      );
  })
);

ordersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const query = listQuerySchema.parse(req.query);
    const isAdmin = req.auth?.role === "admin";
    const filter =
      isAdmin && req.query.mine !== "true" ? {} : { userId: req.auth!.userId };

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      data: orders.map((order) => toOrderDto(order, getOrderCustomer(order))),
      total,
      page,
      limit,
    });
  })
);

ordersRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!order) {
      throw new AppError(404, "Order not found");
    }

    const isOwner = getOrderUserId(order) === req.auth!.userId;
    if (!isOwner && req.auth!.role !== "admin") {
      throw new AppError(403, "Forbidden");
    }

    res.json(toOrderDto(order, getOrderCustomer(order)));
  })
);

ordersRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payload = updateOrderStatusSchema.parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new AppError(404, "Order not found");
    }

    order.status = payload.status;
    await order.save();
    await order.populate("userId", "name email");
    res.json(toOrderDto(order, getOrderCustomer(order)));
  })
);
