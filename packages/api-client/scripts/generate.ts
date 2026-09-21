import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { API_CLIENT_ROOT, REPO_ROOT } from "./repo-root.js";

function run(command: string, cwd = REPO_ROOT) {
  execSync(command, { cwd, stdio: "inherit" });
}

function assertGeneratedClientReady() {
  const required = [
    join(API_CLIENT_ROOT, "src/generated/platform.schemas.ts"),
    join(API_CLIENT_ROOT, "src/generated/products/products.ts"),
    join(API_CLIENT_ROOT, "src/generated/index.ts"),
  ];
  const missing = required.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    throw new Error(
      `Orval/barrel output incomplete (missing: ${missing.join(", ")}). Re-run npm run api:generate.`
    );
  }
}

run("npm run build -w @platform/shared");
run("npm run openapi:generate -w @platform/server");
run("orval --config orval.config.ts", API_CLIENT_ROOT);
run("node scripts/generate-orval-barrel.mjs", API_CLIENT_ROOT);
assertGeneratedClientReady();
run("npm run format", API_CLIENT_ROOT);
assertGeneratedClientReady();
run("npm run build", API_CLIENT_ROOT);

console.log("API client generated.");
