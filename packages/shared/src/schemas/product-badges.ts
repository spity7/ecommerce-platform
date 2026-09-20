import { z } from "../zod.js";
import { sanitizeProductMerchandising } from "../product-badges/sanitize.js";

export {
  manualProductBadgeSchema,
  productBadgeKindSchema,
  productCardBadgeDtoSchema,
  productMerchandisingShape,
  type ManualProductBadge,
  type ProductCardBadgeDto,
  type ProductMerchandising,
} from "./product-badge-fields.js";

import { productMerchandisingShape } from "./product-badge-fields.js";

/** API + persistence: sanitize auto-only manual kinds and invalid entries before validate. */
export const productMerchandisingSchema = z.preprocess(
  (input) => sanitizeProductMerchandising(input),
  productMerchandisingShape
);
