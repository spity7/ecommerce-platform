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
  verifyCustomerEmail,
} from "./helpers.js";
import { Wishlist } from "../src/models/Wishlist.js";

describe("wishlist API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("requires authentication", async () => {
    await request(app).get("/api/wishlist").expect(401);
  });

  it("adds, lists, removes, clears, and moves items to cart", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);
    const token = body.accessToken;

    const emptyResponse = await request(app)
      .get("/api/wishlist")
      .set(authHeader(token))
      .expect(200);

    assert.equal(emptyResponse.body.itemCount, 0);
    assert.deepEqual(emptyResponse.body.items, []);

    const addResponse = await request(app)
      .post("/api/wishlist/items")
      .set(authHeader(token))
      .send({ productId: product._id.toString() })
      .expect(201);

    assert.equal(addResponse.body.itemCount, 1);
    assert.equal(addResponse.body.items[0].productId, product._id.toString());
    assert.equal(addResponse.body.items[0].productSlug, product.slug);
    assert.equal(addResponse.body.items[0].inStock, true);

    const duplicateResponse = await request(app)
      .post("/api/wishlist/items")
      .set(authHeader(token))
      .send({ productId: product._id.toString() })
      .expect(201);

    assert.equal(duplicateResponse.body.itemCount, 1);

    const moveResponse = await request(app)
      .post("/api/wishlist/move-to-cart")
      .set(authHeader(token))
      .send({ productId: product._id.toString(), quantity: 2 })
      .expect(200);

    assert.equal(moveResponse.body.wishlist.itemCount, 0);
    assert.equal(moveResponse.body.cart.itemCount, 2);
    assert.equal(moveResponse.body.cart.items[0].quantity, 2);

    await request(app)
      .post("/api/wishlist/items")
      .set(authHeader(token))
      .send({ productId: product._id.toString() })
      .expect(201);

    const removeResponse = await request(app)
      .delete(`/api/wishlist/items/${product._id.toString()}`)
      .set(authHeader(token))
      .expect(200);

    assert.equal(removeResponse.body.itemCount, 0);

    await request(app)
      .post("/api/wishlist/items")
      .set(authHeader(token))
      .send({ productId: product._id.toString() })
      .expect(201);

    const clearResponse = await request(app)
      .delete("/api/wishlist")
      .set(authHeader(token))
      .expect(200);

    assert.equal(clearResponse.body.itemCount, 0);

    const wishlistDoc = await Wishlist.findOne({ userId: body.user.id });
    assert.ok(wishlistDoc);
    assert.equal(wishlistDoc.items.length, 0);
  });

  it("returns 404 for unknown wishlist items", async () => {
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

    await request(app)
      .delete("/api/wishlist/items/000000000000000000000000")
      .set(authHeader(body.accessToken))
      .expect(404);

    await request(app)
      .post("/api/wishlist/move-to-cart")
      .set(authHeader(body.accessToken))
      .send({ productId: "000000000000000000000000" })
      .expect(404);
  });
});
