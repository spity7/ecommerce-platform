import { z } from "../zod.js";
import { PRODUCT_BADGE_KINDS } from "../types/product-badges.js";

export const productBadgeKindSchema = z.enum(PRODUCT_BADGE_KINDS);

export const manualProductBadgeSchema = z.object({
  kind: productBadgeKindSchema,
});

export const productMerchandisingShape = z.object({
  manualBadges: z.array(manualProductBadgeSchema).max(2),
  suppressAutoBadges: z.array(productBadgeKindSchema).optional(),
});

export const productCardBadgeDtoSchema = z.object({
  kind: productBadgeKindSchema,
  text: z.string(),
  bg: z.string(),
});

export type ProductMerchandising = z.infer<typeof productMerchandisingShape>;
export type ManualProductBadge = z.infer<typeof manualProductBadgeSchema>;
export type ProductCardBadgeDto = z.infer<typeof productCardBadgeDtoSchema>;
