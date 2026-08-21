import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { mountSwaggerUi } from "./openapi/swagger.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Guest-Cart-Id"],
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({
      message: `${env.site.name} API`,
      siteId: env.site.id,
      health: "/api/health",
      docs: "/api/docs",
      openapi: "/api/openapi.json",
    });
  });

  mountSwaggerUi(app);

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}
