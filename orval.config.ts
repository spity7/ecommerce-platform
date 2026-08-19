import { defineConfig } from "orval";

export default defineConfig({
  platformApi: {
    input: "./packages/api-client/openapi.json",
    output: {
      // Single file: all endpoints + types (no per-tag folders or per-schema files).
      target: "./packages/api-client/src/generated/client.ts",
      client: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: "./packages/api-client/src/mutator.ts",
          name: "customFetch",
        },
      },
    },
  },
});
