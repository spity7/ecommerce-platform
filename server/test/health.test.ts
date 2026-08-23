import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import {
  createTestApp,
  setupTestDatabase,
  teardownTestDatabase,
} from "./helpers.js";

describe("health API", () => {
  const app = createTestApp();

  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  it("GET /api/health returns service status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    assert.equal(response.body.ok, true);
    assert.equal(response.body.service, "ecommerce-platform-server");
    assert.equal(response.body.siteId, "beauty-station");
    assert.equal(response.body.database, "connected");
    assert.equal(response.body.mail, "not_configured");
  });
});
