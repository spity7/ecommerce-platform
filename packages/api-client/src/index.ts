/**
 * Platform HTTP API (Orval-generated + axios mutator).
 * Regenerate: `npm run api:generate`
 */

export { platformInstance, customInstance, ApiError } from "./mutator.js";
export { getApiBaseUrl } from "./apiBaseUrl.js";
export { getAxiosErrorDetail } from "./errors.js";
export * from "./generated/index.js";

export {
  fetchAttributes,
  fetchBrands,
  fetchCategories,
  fetchProductBySlug,
  fetchProducts,
  fetchPublishedProducts,
  removeProduct,
} from "./helpers.js";
