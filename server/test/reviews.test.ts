import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import {
  authHeader,
  createTestApp,
  registerAdmin,
  registerCustomer,
  seedPublishedProduct,
  setupTestDatabase,
  teardownTestDatabase,
  verifyCustomerEmail,
  TEST_PHONE,
} from "./helpers.js";
import { Product } from "../src/models/Product.js";
import { Review } from "../src/models/Review.js";
import { Order } from "../src/models/Order.js";

const reviewPayload = {
  rating: 5,
  title: "Great product",
  body: "Works exactly as described.",
};

describe("reviews API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("requires auth to submit a review", async () => {
    const product = await seedPublishedProduct();
    await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .send(reviewPayload)
      .expect(401);
  });

  it("requires verified email to submit a review", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);

    await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(403);
  });

  it("submits pending review and hides it from public list until approved", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    const submitResponse = await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    assert.equal(submitResponse.body.status, "pending");

    const publicList = await request(app)
      .get(`/api/products/${product._id.toString()}/reviews`)
      .expect(200);

    assert.equal(publicList.body.total, 0);

    const admin = await registerAdmin(app);
    await request(app)
      .patch(`/api/admin/reviews/${submitResponse.body.id}`)
      .set(authHeader(admin.body.accessToken))
      .send({ status: "approved" })
      .expect(200);

    const approvedList = await request(app)
      .get(`/api/products/${product._id.toString()}/reviews`)
      .expect(200);

    assert.equal(approvedList.body.total, 1);
    assert.equal(approvedList.body.data[0].title, reviewPayload.title);

    const updatedProduct = await Product.findById(product._id);
    assert.equal(updatedProduct?.reviewCount, 1);
    assert.equal(updatedProduct?.averageRating, 5);
  });

  it("upserts one review per customer per product", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    const second = await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send({ ...reviewPayload, title: "Updated title" })
      .expect(201);

    assert.equal(second.body.title, "Updated title");
    assert.equal(await Review.countDocuments({ productId: product._id }), 1);
  });

  it("refreshes verifiedPurchase when an order is placed after the review", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    const submitResponse = await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    assert.equal(submitResponse.body.verifiedPurchase, false);

    await request(app)
      .post("/api/cart/items")
      .set(authHeader(body.accessToken))
      .send({ productId: product._id.toString(), quantity: 1 })
      .expect(201);

    await request(app)
      .post("/api/orders")
      .set(authHeader(body.accessToken))
      .send({
        shippingAddress: {
          name: "Test Customer",
          line1: "123 Test Street",
          city: "Austin",
          country: "United States",
          phone: TEST_PHONE,
        },
      })
      .expect(201);

    const myReviews = await request(app)
      .get("/api/reviews/me")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(myReviews.body.data.length, 1);
    assert.equal(myReviews.body.data[0].verifiedPurchase, true);
  });

  it("clears verifiedPurchase when the only order for the product is cancelled", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    await request(app)
      .post("/api/cart/items")
      .set(authHeader(body.accessToken))
      .send({ productId: product._id.toString(), quantity: 1 })
      .expect(201);

    const orderResponse = await request(app)
      .post("/api/orders")
      .set(authHeader(body.accessToken))
      .send({
        shippingAddress: {
          name: "Test Customer",
          line1: "123 Test Street",
          city: "Austin",
          country: "United States",
          phone: TEST_PHONE,
        },
      })
      .expect(201);

    await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    await request(app)
      .post(`/api/orders/${orderResponse.body.id}/cancel`)
      .set(authHeader(body.accessToken))
      .expect(200);

    const myReviews = await request(app)
      .get("/api/reviews/me")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(myReviews.body.data[0].verifiedPurchase, false);
  });

  it("sets verifiedPurchase when customer ordered the product", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    await Order.create({
      userId: body.user.id,
      status: "delivered",
      items: [
        {
          productId: product._id,
          quantity: 1,
          productName: product.name,
          productSlug: product.slug,
          productImage: "",
          price: product.price,
        },
      ],
      subtotal: product.price,
      total: product.price,
    });

    const response = await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    assert.equal(response.body.verifiedPurchase, true);
  });

  it("deletes reviews when product is deleted", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);
    const admin = await registerAdmin(app);

    const review = await request(app)
      .post(`/api/products/${product._id.toString()}/reviews`)
      .set(authHeader(body.accessToken))
      .send(reviewPayload)
      .expect(201);

    await request(app)
      .patch(`/api/admin/reviews/${review.body.id}`)
      .set(authHeader(admin.body.accessToken))
      .send({ status: "approved" })
      .expect(200);

    await request(app)
      .delete(`/api/products/${product._id.toString()}`)
      .set(authHeader(admin.body.accessToken))
      .expect(204);

    assert.equal(await Review.countDocuments({ productId: product._id }), 0);
  });
});
