import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const API_CLIENT_ROOT = packageRoot;
export const REPO_ROOT = resolve(packageRoot, "../..");
