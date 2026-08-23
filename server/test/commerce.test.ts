import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import {
  authHeader,
  createTestApp,
  registerCustomer,
  seedPublishedProduct,
  setupTestDatabase,
  teardownTestDatabase,
} from "./helpers.js";

describe("commerce API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("adds cart items and places an order", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);

    const addResponse = await request(app)
      .post("/api/cart/items")
      .set(authHeader(body.accessToken))
      .send({ productId: product._id.toString(), quantity: 2 })
      .expect(201);

    assert.equal(addResponse.body.itemCount, 2);
    assert.equal(addResponse.body.items.length, 1);
    assert.equal(addResponse.body.items[0].quantity, 2);

    const orderResponse = await request(app)
      .post("/api/orders")
      .set(authHeader(body.accessToken))
      .send({
        shippingAddress: {
          name: "Test Customer",
          line1: "123 Test Street",
          city: "Austin",
          country: "United States",
          phone: "555-0100",
        },
      })
      .expect(201);

    assert.equal(orderResponse.body.status, "pending");
    assert.equal(orderResponse.body.itemCount, 2);
    assert.equal(orderResponse.body.customerEmail, body.user.email);

    const ordersResponse = await request(app)
      .get("/api/orders")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(ordersResponse.body.data.length, 1);
    assert.equal(ordersResponse.body.total, 1);
  });

  it("supports guest cart with X-Guest-Cart-Id header", async () => {
    const product = await seedPublishedProduct();
    const guestSessionId = `guest-${Date.now()}`;

    await request(app)
      .post("/api/cart/items")
      .set("X-Guest-Cart-Id", guestSessionId)
      .send({ productId: product._id.toString(), quantity: 1 })
      .expect(201);

    const cartResponse = await request(app)
      .get("/api/cart")
      .set("X-Guest-Cart-Id", guestSessionId)
      .expect(200);

    assert.equal(cartResponse.body.itemCount, 1);
  });
});
