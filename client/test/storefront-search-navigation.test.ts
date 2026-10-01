import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildStorefrontCatalogSearchHref,
  STOREFRONT_PRODUCT_DETAILS_PATH,
} from "../lib/storefront-search-navigation.js";

describe("storefront-search-navigation", () => {
  it("builds shop href with search query on page 1", () => {
    assert.equal(
      buildStorefrontCatalogSearchHref("lipstick"),
      "/shop?search=lipstick"
    );
  });

  it("builds shop href without search when empty or whitespace", () => {
    assert.equal(buildStorefrontCatalogSearchHref(""), "/shop");
    assert.equal(buildStorefrontCatalogSearchHref("   "), "/shop");
    assert.equal(buildStorefrontCatalogSearchHref(undefined), "/shop");
  });

  it("exposes stable product details path prefix", () => {
    assert.equal(STOREFRONT_PRODUCT_DETAILS_PATH, "/product");
  });
});
