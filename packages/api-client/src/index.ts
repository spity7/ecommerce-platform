/**
 * Platform HTTP API (Orval-generated + axios mutator).
 * Regenerate: `npm run api:generate`
 */

export { platformInstance, customInstance, ApiError } from "./mutator.js";
export { getApiBaseUrl } from "./apiBaseUrl.js";
export { getAccessToken, setAccessToken } from "./auth.js";
export { setGuestCartId, getGuestCartId } from "./guest-cart.js";
export {
  registerUnauthorizedHandler,
  type UnauthorizedHandler,
} from "./unauthorized.js";
export { getAxiosErrorDetail } from "./errors.js";
export * from "./generated/index.js";

export {
  createAttributeApi,
  createBrandApi,
  createCategoryApi,
  createProductApi,
  deleteAttributeApi,
  deleteBrandApi,
  deleteCategoryApi,
  deleteProductApi,
  fetchAttributes,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  fetchProductBySlug,
  fetchProducts,
  fetchPublishedProducts,
  getAttributeApi,
  getBrandApi,
  getCategoryApi,
  getProductApi,
  removeProduct,
  updateAttributeApi,
  updateBrandApi,
  updateCategoryApi,
  updateProductApi,
} from "./helpers.js";

export {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart,
  createOrderFromCart,
  fetchOrders,
  fetchOrder,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  fetchUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "./commerce-api.js";
