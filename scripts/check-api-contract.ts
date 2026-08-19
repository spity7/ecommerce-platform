import { execSync } from "node:child_process";

const repoRoot = process.cwd();
const contractPaths = [
  "packages/api-client/openapi.json",
  "packages/api-client/src/generated",
];

function run(command: string) {
  execSync(command, { cwd: repoRoot, stdio: "inherit" });
}

console.log("Regenerating OpenAPI spec and API client...");
run("npm run api:generate");

const status = execSync(
  `git status --porcelain -- ${contractPaths.join(" ")}`,
  { cwd: repoRoot, encoding: "utf8" },
).trim();

if (status) {
  console.error("\nAPI contract is out of date.");
  console.error("Run `npm run api:generate` and commit the changes:\n");
  console.error(status);
  process.exit(1);
}

console.log("API contract is up to date.");
