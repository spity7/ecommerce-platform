import { Router } from "express";
import mongoose from "mongoose";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "ecommerce-platform-server",
    siteId: env.site.id,
    siteName: env.site.name,
    environment: env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    gcs: env.gcs.isConfigured ? "configured" : "not_configured",
    timestamp: new Date().toISOString(),
  });
});
