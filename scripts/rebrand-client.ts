#!/usr/bin/env tsx
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Run from client workspace: npm run rebrand
const ROOT = join(process.cwd(), "..");

const TITLE_SUFFIX = "Beauty Station | Cosmetics & Skincare";
const DESCRIPTION =
  "Discover premium cosmetics and skincare products at Beauty Station.";
const BRAND = "Beauty Station";

const REPLACEMENTS: Array<[RegExp, string]> = [
  [
    /\|\|\s*Unimart - eCommerce React Nextjs Bootstrap5 Template/g,
    `| ${TITLE_SUFFIX}`,
  ],
  [/Unimart - eCommerce React Nextjs Bootstrap5 Template/g, DESCRIPTION],
  [/Welcome to Unimart\b/g, `Welcome to ${BRAND}`],
  [/\bUnimart's\b/g, `${BRAND}'s`],
  [/support@unimart\.com/gi, "hello@beautystation.com"],
  [/support@unimart\.local/gi, "hello@beautystation.com"],
  [/admin@unimart\.local/gi, "admin@beautystation.com"],
  [/unimart-store/g, "beauty-station-store"],
  [/unimart-theme/g, "site-theme"],
  [/getunimart\.com[^\s"']*/g, "/"],
  [/#unimartbakeryalways/g, "#beautystation"],
  [/Unimart's/g, "Beauty Station's"],
  [/Search Unimart \.\./g, `Search ${BRAND} ..`],
  [/Unimart Grocery/g, BRAND],
  [/Unimart Admin Next\.js template/g, `${BRAND} Admin`],
  [/Unimart product promotion/g, `${BRAND} product promotion`],
  [/Headphones - Unimart/g, `Headphones - ${BRAND}`],
  [/\bUnimart\b/g, BRAND],
  [/\bUNIMART\b/g, BRAND.toUpperCase()],
  [/\bunimart\b/g, "beauty-station"],
];

const SKIP_PATH_PARTS = [
  "node_modules",
  ".next",
  "package-lock.json",
  "rebrand-client.ts",
];

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (SKIP_PATH_PARTS.some((part) => full.includes(part))) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(tsx?|scss|json)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

function rebrandDir(dir: string) {
  let changed = 0;
  for (const file of walk(dir)) {
    let content = readFileSync(file, "utf8");
    const original = content;
    for (const [pattern, replacement] of REPLACEMENTS) {
      content = content.replace(pattern, replacement);
    }
    if (content !== original) {
      writeFileSync(file, content, "utf8");
      changed++;
    }
  }
  return changed;
}

const clientChanged = rebrandDir(join(ROOT, "client"));
const adminChanged = rebrandDir(join(ROOT, "admin"));

console.log(
  `Rebranded ${clientChanged} client files and ${adminChanged} admin files.`
);
