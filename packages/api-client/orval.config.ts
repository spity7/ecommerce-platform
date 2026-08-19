/**
 * Orval codegen (`npm run generate -w @platform/api-client`).
 * Then `scripts/generate-orval-barrel.mjs` writes `src/generated/index.ts`.
 */
import { defineConfig } from "orval";

export default defineConfig({
  platform: {
    input: {
      target: "./openapi.json",
      override: {
        transformer: "./openapi-transformer.cjs",
      },
    },
    output: {
      target: "./src/generated/platform.ts",
      client: "axios",
      mode: "tags-split",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./src/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
