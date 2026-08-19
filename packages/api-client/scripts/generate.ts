import { execSync } from "node:child_process";
import { API_CLIENT_ROOT, REPO_ROOT } from "./repo-root.js";

function run(command: string, cwd = REPO_ROOT) {
  execSync(command, { cwd, stdio: "inherit" });
}

run("npm run build -w @platform/shared");
run("npm run openapi:generate -w @platform/server");
run("orval --config orval.config.ts", API_CLIENT_ROOT);
run("node scripts/generate-orval-barrel.mjs", API_CLIENT_ROOT);
run("npm run format", API_CLIENT_ROOT);
run("npm run build", API_CLIENT_ROOT);

console.log("API client generated.");
