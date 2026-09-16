import { z } from "../zod.js";
import { PRODUCT_BADGE_KINDS } from "../types/product-badges.js";

export const productBadgeKindSchema = z.enum(PRODUCT_BADGE_KINDS);

export const productBadgeStyleSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^rbt-product-badge-/, "Expected a theme product badge class");

export const manualProductBadgeSchema = z.object({
  kind: productBadgeKindSchema,
  label: z.string().trim().min(1).max(24).optional(),
  style: productBadgeStyleSchema.optional(),
});

export const productMerchandisingSchema = z.object({
  manualBadges: z.array(manualProductBadgeSchema).max(2).default([]),
  suppressAutoBadges: z.array(productBadgeKindSchema).optional(),
});

export const productCardBadgeDtoSchema = z.object({
  kind: productBadgeKindSchema,
  text: z.string(),
  bg: z.string(),
});

export type ProductMerchandising = z.infer<typeof productMerchandisingSchema>;
export type ManualProductBadge = z.infer<typeof manualProductBadgeSchema>;
export type ProductCardBadgeDto = z.infer<typeof productCardBadgeDtoSchema>;
