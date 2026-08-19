import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createOpenApiDocument } from "./registry.js";

const outputPath = resolve(
  process.cwd(),
  "../packages/api-client/openapi.json"
);

const document = createOpenApiDocument();
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

console.log(`OpenAPI spec written to ${outputPath}`);
