import { defineConfig } from "orval";

export default defineConfig({
  platformApi: {
    input: "./packages/api-client/openapi.json",
    output: {
      target: "./packages/api-client/src/generated/endpoints.ts",
      schemas: "./packages/api-client/src/generated/models",
      client: "fetch",
      mode: "tags-split",
      clean: true,
      override: {
        mutator: {
          path: "./packages/api-client/src/mutator.ts",
          name: "customFetch",
        },
      },
    },
  },
});
