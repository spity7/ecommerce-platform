import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { createOpenApiDocument } from "./registry.js";

export function mountSwaggerUi(app: Express): void {
  const document = createOpenApiDocument();

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/openapi.json", (_req, res) => {
    res.json(document);
  });
}
