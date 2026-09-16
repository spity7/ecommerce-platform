import type { SeedCatalogResult } from "./seed-catalog.js";
import type { SeedUserResult } from "./seed-users.js";

export function printSeedSummary(input: {
  siteName: string;
  siteId: string;
  datasetLabel: string;
  catalog: SeedCatalogResult;
  admin: SeedUserResult;
  demoCustomer: SeedUserResult | null;
  removedCustomers: number;
  reviewCount?: number;
  credentialHints: {
    adminUsesDefaultPassword: boolean;
    demoUsesDefaultPassword: boolean;
  };
}): void {
  const divider = "─".repeat(52);

  console.log("");
  console.log(divider);
  console.log(`  ${input.siteName} — fresh seed complete`);
  console.log(divider);
  console.log(`  Site:       ${input.siteId}`);
  console.log(`  Dataset:    ${input.datasetLabel}`);
  console.log(
    `  Catalog:    ${input.catalog.categories} categories, ${input.catalog.brands} brands, ${input.catalog.attributes} attributes`
  );
  console.log(
    `  Products:   ${input.catalog.publishedProducts} published, ${input.catalog.products - input.catalog.publishedProducts} draft (${input.catalog.products} total)`
  );
  console.log(`  Commerce:   carts, orders, wishlists, and reviews cleared`);
  if (input.reviewCount !== undefined && input.reviewCount > 0) {
    console.log(`  Reviews:    ${input.reviewCount} sample review(s) seeded`);
  }
  if (input.removedCustomers > 0) {
    console.log(`  Customers:  removed ${input.removedCustomers} stale account(s)`);
  }
  console.log("");
  console.log("  Sign-in accounts");
  console.log(
    `  Admin:      ${input.admin.email} / ${input.admin.password} (${input.admin.action})`
  );
  if (input.demoCustomer) {
    console.log(
      `  Customer:   ${input.demoCustomer.email} / ${input.demoCustomer.password} (${input.demoCustomer.action})`
    );
  } else {
    console.log("  Customer:   skipped (SEED_DEMO_CUSTOMER=false)");
  }
  console.log("");
  console.log("  Images use storefront /assets paths — no GCS upload required.");
  if (
    input.credentialHints.adminUsesDefaultPassword ||
    input.credentialHints.demoUsesDefaultPassword
  ) {
    console.log("");
    console.log("  Dev defaults in use. Set ADMIN_* and DEMO_CUSTOMER_* in server/.env for production.");
  }
  console.log(divider);
  console.log("");
}
