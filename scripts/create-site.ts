#!/usr/bin/env tsx
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const siteId = args[0];
const templateFlagIndex = args.indexOf("--template");
const template =
  templateFlagIndex >= 0 ? args[templateFlagIndex + 1] : "general";

if (!siteId || siteId.startsWith("-")) {
  console.error(
    "Usage: npm run create-site <site-id> [--template beauty|sport|general]",
  );
  process.exit(1);
}

const slug = siteId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
const siteDir = join(process.cwd(), "sites", slug);

if (existsSync(siteDir)) {
  console.error(`Site folder already exists: ${siteDir}`);
  process.exit(1);
}

mkdirSync(siteDir, { recursive: true });

const homeLayout =
  template === "beauty"
    ? "cosmetic-beauty-two"
    : template === "sport"
      ? "sport"
      : "general";

writeFileSync(
  join(siteDir, ".env.example"),
  `SITE_ID=${slug}
MONGODB_URI=mongodb://127.0.0.1:27017/${slug}
GCS_BUCKET_NAME=${slug}-media

NEXT_PUBLIC_SITE_ID=${slug}
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`,
);

writeFileSync(
  join(siteDir, "README.md"),
  `# ${slug}

Template: \`${template}\`
Home layout: \`${homeLayout}\`

## Next steps

1. Add \`packages/site-config/src/sites/${slug}.ts\`
2. Register the site in \`packages/site-config/src/index.ts\`
3. Add an entry to \`docs/site-registry.json\`
4. Copy env vars into \`client\`, \`admin\`, and \`server\`
5. Deploy with a dedicated MongoDB database and GCS bucket
`,
);

console.log(`Created site scaffold at sites/${slug}`);
console.log("");
console.log("Next steps:");
console.log(`  1. Add packages/site-config/src/sites/${slug}.ts`);
console.log("  2. Register in packages/site-config/src/index.ts");
console.log("  3. Update docs/site-registry.json");
console.log(`  4. Create MongoDB database: ${slug}`);
