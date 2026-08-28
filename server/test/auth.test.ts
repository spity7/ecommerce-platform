import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { User } from "../src/models/User.js";
import {
  authHeader,
  createTestApp,
  registerCustomer,
  registerGoogleCustomer,
  seedPublishedProduct,
  setupTestDatabase,
  teardownTestDatabase,
  testGoogleIdToken,
  verifyCustomerEmail,
} from "./helpers.js";

describe("auth API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("registers a customer and returns tokens", async () => {
    const { body, email } = await registerCustomer(app);

    assert.ok(body.accessToken);
    assert.ok(body.refreshToken);
    assert.equal(body.user.email, email);
    assert.equal(body.user.role, "customer");
  });

  it("logs in with valid credentials", async () => {
    const email = `login-${Date.now()}@example.com`;
    await registerCustomer(app, email);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "Password1!Strong" })
      .expect(200);

    assert.ok(response.body.accessToken);
    assert.equal(response.body.user.email, email);
  });

  it("returns current user for a valid access token", async () => {
    const { body, email } = await registerCustomer(app);

    const response = await request(app)
      .get("/api/auth/me")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(response.body.email, email);
  });

  it("refreshes tokens with a valid refresh token", async () => {
    const { body } = await registerCustomer(app);

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: body.refreshToken })
      .expect(200);

    assert.ok(response.body.accessToken);
    assert.ok(response.body.refreshToken);
  });

  it("revokes refresh token after logout", async () => {
    const { body } = await registerCustomer(app);

    await request(app)
      .post("/api/auth/logout")
      .set(authHeader(body.accessToken))
      .expect(200);

    await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: body.refreshToken })
      .expect(401);
  });

  it("revokes access token after logout", async () => {
    const { body } = await registerCustomer(app);

    await request(app)
      .post("/api/auth/logout")
      .set(authHeader(body.accessToken))
      .expect(200);

    await request(app)
      .get("/api/auth/me")
      .set(authHeader(body.accessToken))
      .expect(401);
  });

  it("runs forgot-password and reset-password flow", async () => {
    const email = `reset-${Date.now()}@example.com`;
    await registerCustomer(app, email);

    const forgotResponse = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email })
      .expect(200);

    assert.equal(forgotResponse.body.ok, true);
    assert.ok(forgotResponse.body.devResetCode);

    await request(app)
      .post("/api/auth/reset-password")
      .send({
        email,
        code: forgotResponse.body.devResetCode,
        newPassword: "NewPassword1!Strong",
      })
      .expect(200);

    await request(app)
      .post("/api/auth/login")
      .send({ email, password: "NewPassword1!Strong" })
      .expect(200);
  });

  it("changes password for the authenticated user", async () => {
    const { body } = await registerCustomer(app);

    await request(app)
      .patch("/api/users/me/password")
      .set(authHeader(body.accessToken))
      .send({
        currentPassword: "Password1!Strong",
        newPassword: "ChangedPassword1!",
      })
      .expect(200);

    await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: body.refreshToken })
      .expect(401);
  });

  it("creates and lists a saved address", async () => {
    const { body } = await registerCustomer(app);

    const createResponse = await request(app)
      .post("/api/users/me/addresses")
      .set(authHeader(body.accessToken))
      .send({
        name: "Test Customer",
        line1: "123 Test Street",
        city: "Austin",
        country: "United States",
        phone: "555-0100",
        isDefault: true,
      })
      .expect(201);

    assert.equal(createResponse.body.line1, "123 Test Street");
    assert.equal(createResponse.body.isDefault, true);

    const listResponse = await request(app)
      .get("/api/users/me/addresses")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(listResponse.body.length, 1);
  });

  it("verifies email with a dev verification code", async () => {
    const { body } = await registerCustomer(app);

    assert.equal(body.user.emailVerified, false);

    const requestResponse = await request(app)
      .post("/api/auth/request-email-verification")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(requestResponse.body.ok, true);
    assert.ok(requestResponse.body.devVerificationCode);

    const verifyResponse = await request(app)
      .post("/api/auth/verify-email")
      .set(authHeader(body.accessToken))
      .send({ code: requestResponse.body.devVerificationCode })
      .expect(200);

    assert.equal(verifyResponse.body.emailVerified, true);
  });

  it("soft-deletes account and reactivates on login", async () => {
    const { body, email } = await registerCustomer(app);

    await request(app)
      .delete("/api/users/me")
      .set(authHeader(body.accessToken))
      .send({ password: "Password1!Strong" })
      .expect(200);

    const deletedUser = await User.findOne({ email }).lean();
    assert.ok(deletedUser?.deletedAt);

    await request(app)
      .get("/api/users/me")
      .set(authHeader(body.accessToken))
      .expect(401);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "Password1!Strong" })
      .expect(200);

    assert.ok(loginResponse.body.accessToken);

    const profileResponse = await request(app)
      .get("/api/users/me")
      .set(authHeader(loginResponse.body.accessToken))
      .expect(200);

    assert.equal(profileResponse.body.email, email);

    const reactivatedUser = await User.findOne({ email }).lean();
    assert.equal(reactivatedUser?.deletedAt, undefined);
    assert.equal("deletedAt" in (reactivatedUser ?? {}), false);
  });

  it("reactivates a soft-deleted Google account on social sign-in", async () => {
    const email = `google-reactivate-${Date.now()}@example.com`;
    const sub = "google-reactivate-sub";
    const { body } = await registerGoogleCustomer(app, email, sub);

    await request(app)
      .delete("/api/users/me")
      .set(authHeader(body.accessToken))
      .send({ idToken: testGoogleIdToken(email, sub) })
      .expect(200);

    const deletedUser = await User.findOne({ email }).lean();
    assert.ok(deletedUser?.deletedAt);

    const loginResponse = await request(app)
      .post("/api/auth/social")
      .send({
        provider: "google",
        idToken: testGoogleIdToken(email, sub),
      })
      .expect(200);

    assert.ok(loginResponse.body.accessToken);

    const reactivatedUser = await User.findOne({ email }).lean();
    assert.equal(reactivatedUser?.deletedAt, undefined);
    assert.equal("deletedAt" in (reactivatedUser ?? {}), false);
  });

  it("returns profile from GET /api/users/me", async () => {
    const { body, email } = await registerCustomer(app);

    const response = await request(app)
      .get("/api/users/me")
      .set(authHeader(body.accessToken))
      .expect(200);

    assert.equal(response.body.email, email);
    assert.equal(response.body.passwordSetByUser, true);
  });

  it("updates avatarUrl via PATCH /api/users/me", async () => {
    const { body } = await registerCustomer(app);
    const avatarUrl = "https://example.com/avatar.jpg";

    const response = await request(app)
      .patch("/api/users/me")
      .set(authHeader(body.accessToken))
      .send({ avatarUrl })
      .expect(200);

    assert.equal(response.body.avatarUrl, avatarUrl);
  });

  it("blocks admin self-delete from storefront", async () => {
    const email = `admin-${Date.now()}@example.com`;
    const { body } = await registerCustomer(app, email);
    await User.updateOne({ email }, { $set: { role: "admin" } });

    await request(app)
      .delete("/api/users/me")
      .set(authHeader(body.accessToken))
      .send({ password: "Password1!Strong" })
      .expect(403);
  });

  it("registers via Google social auth", async () => {
    const email = `social-${Date.now()}@example.com`;
    const { body } = await registerGoogleCustomer(app, email, "google-sub-1");

    assert.equal(body.user.email, email);
    assert.equal(body.user.emailVerified, true);
    assert.equal(body.user.passwordSetByUser, false);
    assert.equal(body.user.oauthProvider, "google");
  });

  it("imports Google profile picture on social sign-in", async () => {
    const email = `google-picture-${Date.now()}@example.com`;
    const picture = "https://example.com/google-avatar.jpg";

    await request(app)
      .post("/api/auth/social")
      .send({
        provider: "google",
        idToken: testGoogleIdToken(email, "google-picture-sub", picture),
      })
      .expect(201);

    const user = await User.findOne({ email });
    assert.ok(user);
    assert.equal(user.avatarUrl, picture);
  });

  it("allows Google-only users to delete with idToken confirmation", async () => {
    const email = `google-delete-${Date.now()}@example.com`;
    const sub = "google-delete-sub";
    const { body } = await registerGoogleCustomer(app, email, sub);

    await request(app)
      .delete("/api/users/me")
      .set(authHeader(body.accessToken))
      .send({ idToken: testGoogleIdToken(email, sub) })
      .expect(200);
  });

  it("allows Google-only users to set a password with idToken confirmation", async () => {
    const email = `google-password-${Date.now()}@example.com`;
    const sub = "google-password-sub";
    const { body } = await registerGoogleCustomer(app, email, sub);

    await request(app)
      .patch("/api/users/me/password")
      .set(authHeader(body.accessToken))
      .send({
        newPassword: "NewPassword1!Strong",
        idToken: testGoogleIdToken(email, sub),
      })
      .expect(200);

    await request(app)
      .post("/api/auth/login")
      .send({ email, password: "NewPassword1!Strong" })
      .expect(200);
  });

  it("rejects invalid email verification codes", async () => {
    const { body } = await registerCustomer(app);

    await request(app)
      .post("/api/auth/verify-email")
      .set(authHeader(body.accessToken))
      .send({ code: "000000" })
      .expect(400);
  });

  it("rejects placing orders when email is not verified", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);

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
        },
      })
      .expect(403);
  });

  it("allows orders after email verification", async () => {
    const product = await seedPublishedProduct();
    const { body } = await registerCustomer(app);
    await verifyCustomerEmail(app, body.accessToken);

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
        },
      })
      .expect(201);
  });

  it("hard-deletes expired deactivated accounts on re-register", async () => {
    const email = `expired-${Date.now()}@example.com`;
    await registerCustomer(app, email);

    await User.updateOne(
      { email },
      {
        $set: {
          deletedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        },
      }
    );

    const reregister = await registerCustomer(app, email);
    assert.equal(reregister.body.user.email, email);

    const users = await User.find({ email });
    assert.equal(users.length, 1);
    assert.equal(users[0]?.deletedAt, undefined);
  });
});
