import { execSync } from "node:child_process";
import { isApiContractStale } from "./contract-paths.js";
import { REPO_ROOT } from "./repo-root.js";

const checkOnly = process.argv.includes("--check-only");
const skipGenerate = process.env.SKIP_API_GENERATE === "1";

function run(command: string) {
  execSync(command, { cwd: REPO_ROOT, stdio: "inherit" });
}

if (!isApiContractStale(REPO_ROOT)) {
  console.log("API contract is up to date.");
  process.exit(0);
}

const message =
  "API contract is out of date (shared schemas or OpenAPI registry changed).";

if (checkOnly || skipGenerate) {
  console.warn(`${message} Run: npm run api:generate`);
  process.exit(1);
}

console.log(`${message} Regenerating...`);
run("npm run generate -w @platform/api-client");
console.log("API contract regenerated.");
