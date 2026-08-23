import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import {
  authHeader,
  createTestApp,
  registerCustomer,
  setupTestDatabase,
  teardownTestDatabase,
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
});
