import { z } from "../zod.js";
import { ORDER_STATUSES } from "../types/commerce.js";

export const cartItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const mergeCartSchema = z.object({
  guestSessionId: z.string().min(1),
});

export const shippingAddressSchema = z.object({
  name: z.string().min(1).max(120),
  line1: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  country: z.string().min(1).max(120),
  phone: z.string().max(40).optional(),
});

export const userAddressFieldsSchema = shippingAddressSchema.extend({
  line2: z.string().max(200).optional(),
  isDefault: z.boolean().optional(),
});

export const createUserAddressSchema = userAddressFieldsSchema;

export const updateUserAddressSchema = userAddressFieldsSchema.partial();

export const userAddressDtoSchema = userAddressFieldsSchema.extend({
  id: z.string(),
});

export const userAddressListSchema = z.array(userAddressDtoSchema);

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema.optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  phone: z.string().max(40).optional(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export const cartItemDtoSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().int(),
  productName: z.string(),
  productSlug: z.string(),
  productImage: z.string(),
  price: z.number(),
  lineTotal: z.number(),
});

export const cartDtoSchema = z.object({
  id: z.string(),
  items: z.array(cartItemDtoSchema),
  itemCount: z.number().int(),
  subtotal: z.number(),
  guestSessionId: z.string().optional(),
});

export const orderItemDtoSchema = z.object({
  productId: z.string(),
  quantity: z.number().int(),
  productName: z.string(),
  productSlug: z.string(),
  productImage: z.string(),
  price: z.number(),
  lineTotal: z.number(),
});

export const orderDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  status: z.enum(ORDER_STATUSES),
  items: z.array(orderItemDtoSchema),
  itemCount: z.number().int(),
  subtotal: z.number(),
  total: z.number(),
  shippingAddress: shippingAddressSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const paginatedOrdersSchema = z.object({
  data: z.array(orderDtoSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

export type CartItemInput = z.infer<typeof cartItemInputSchema>;
export type CartDto = z.infer<typeof cartDtoSchema>;
export type OrderDto = z.infer<typeof orderDtoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UserAddressDto = z.infer<typeof userAddressDtoSchema>;
export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema>;
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>;
