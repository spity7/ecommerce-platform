import { execSync } from "node:child_process";
import { isApiContractStale } from "./api-contract-paths.js";

// Invoked via root npm scripts — cwd is always the repo root.
const repoRoot = process.cwd();
const checkOnly = process.argv.includes("--check-only");
const skipGenerate = process.env.SKIP_API_GENERATE === "1";

function run(command: string) {
  execSync(command, { cwd: repoRoot, stdio: "inherit" });
}

if (!isApiContractStale(repoRoot)) {
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
run("npm run api:generate");
console.log("API contract regenerated.");
