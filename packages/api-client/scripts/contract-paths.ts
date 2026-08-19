import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const API_CONTRACT_SOURCE_DIRS = [
  "packages/shared/src",
  "server/src/openapi",
] as const;

export const API_CONTRACT_SOURCE_FILES = [
  "packages/api-client/orval.config.ts",
  "packages/api-client/openapi-transformer.cjs",
  "packages/api-client/scripts/generate-orval-barrel.mjs",
] as const;

export const API_CONTRACT_ARTIFACTS = [
  "packages/api-client/openapi.json",
  "packages/api-client/src/generated/platform.schemas.ts",
  "packages/api-client/src/generated/index.ts",
] as const;

function walkSourceFiles(dir: string, files: string[]): void {
  if (!existsSync(dir)) {
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, files);
      continue;
    }

    if (/\.(ts|tsx|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

export function listApiContractSourcePaths(repoRoot: string): string[] {
  const files = API_CONTRACT_SOURCE_FILES.map((file) => join(repoRoot, file));

  for (const dir of API_CONTRACT_SOURCE_DIRS) {
    walkSourceFiles(join(repoRoot, dir), files);
  }

  return files;
}

export function listApiContractArtifactPaths(repoRoot: string): string[] {
  return API_CONTRACT_ARTIFACTS.map((file) => join(repoRoot, file));
}

export function isApiContractStale(repoRoot: string): boolean {
  const sources = listApiContractSourcePaths(repoRoot);
  const artifacts = listApiContractArtifactPaths(repoRoot);

  if (artifacts.some((path) => !existsSync(path))) {
    return true;
  }

  const newestSourceMtime = Math.max(
    ...sources.map((path) => statSync(path).mtimeMs)
  );
  const oldestArtifactMtime = Math.min(
    ...artifacts.map((path) => statSync(path).mtimeMs)
  );

  return newestSourceMtime > oldestArtifactMtime;
}
