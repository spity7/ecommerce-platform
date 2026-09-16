import { getReviews } from "./generated/reviews/reviews.js";
import { getAdmin } from "./generated/admin/admin.js";

const reviewsApi = getReviews();
const adminApi = getAdmin();

export async function fetchProductReviews(
  productId: string,
  params?: Parameters<typeof reviewsApi.listProductReviews>[1]
) {
  return reviewsApi.listProductReviews(productId, params);
}

export async function fetchProductReviewSummary(productId: string) {
  return reviewsApi.getProductReviewSummary(productId);
}

export async function submitProductReview(
  productId: string,
  body: Parameters<typeof reviewsApi.submitProductReview>[1]
) {
  return reviewsApi.submitProductReview(productId, body);
}

export async function fetchMyReviews() {
  return reviewsApi.listMyReviews();
}

export async function updateReview(
  reviewId: string,
  body: Parameters<typeof reviewsApi.updateReview>[1]
) {
  return reviewsApi.updateReview(reviewId, body);
}

export async function deleteReview(reviewId: string) {
  return reviewsApi.deleteReview(reviewId);
}

export async function fetchAdminReviews(
  params?: Parameters<typeof adminApi.listAdminReviews>[0]
) {
  return adminApi.listAdminReviews(params);
}

export async function moderateReview(
  reviewId: string,
  body: Parameters<typeof adminApi.moderateReview>[1]
) {
  return adminApi.moderateReview(reviewId, body);
}

export async function deleteAdminReview(reviewId: string) {
  return adminApi.deleteAdminReview(reviewId);
}
