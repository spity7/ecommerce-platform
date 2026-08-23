import "./setup-env.js";
import type { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { Product } from "../src/models/Product.js";
import type { ProductDocument } from "../src/models/Product.js";

export function createTestApp(): Express {
  return createApp();
}

export async function setupTestDatabase(): Promise<void> {
  await connectDatabase();
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
}

export async function teardownTestDatabase(): Promise<void> {
  await disconnectDatabase();
}

export async function seedPublishedProduct(): Promise<ProductDocument> {
  return Product.create({
    name: "Integration Test Serum",
    slug: `test-serum-${Date.now()}`,
    sku: `TEST-${Date.now()}`,
    price: 29.99,
    stock: 25,
    status: "published",
  });
}

type AuthBody = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
};

export async function registerCustomer(
  app: Express,
  email = `customer-${Date.now()}@example.com`
): Promise<{ body: AuthBody; email: string }> {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test Customer",
      email,
      password: "Password1!Strong",
      phone: "555-0100",
    })
    .expect(201);

  return { body: response.body as AuthBody, email };
}

export function authHeader(accessToken: string): { Authorization: string } {
  return { Authorization: `Bearer ${accessToken}` };
}
