import { after, before, describe, it } from "node:test";
import request from "supertest";
import {
  authHeader,
  createTestApp,
  registerAdmin,
  registerCustomer,
  setupTestDatabase,
  teardownTestDatabase,
} from "./helpers.js";

describe("uploads API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("returns 503 when GCS is not configured", async () => {
    const { body } = await registerAdmin(app);

    await request(app)
      .post("/api/uploads")
      .set(authHeader(body.accessToken))
      .send({})
      .expect(503);
  });

  it("requires authentication", async () => {
    await request(app).post("/api/uploads").send({}).expect(401);
  });

  it("forbids non-admin users", async () => {
    const { body } = await registerCustomer(app);

    await request(app)
      .post("/api/uploads")
      .set(authHeader(body.accessToken))
      .send({})
      .expect(403);
  });
});
