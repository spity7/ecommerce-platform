import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getAutoProductBadgeRuleHintShort,
  mergeMerchandisingPatch,
  productMerchandisingSchema,
  resolveProductCardBadges,
  sanitizeProductMerchandising,
} from "@platform/shared";

describe("resolveProductCardBadges", () => {
  const now = new Date("2026-09-16T12:00:00.000Z");

  it("returns sale and new when discounted and recently created", () => {
    const badges = resolveProductCardBadges({
      price: 59,
      compareAtPrice: 90,
      stock: 10,
      createdAt: "2026-09-01T00:00:00.000Z",
      metadata: {},
      now,
    });

    assert.equal(badges.length, 2);
    assert.equal(badges[0]?.kind, "sale");
    assert.equal(badges[1]?.kind, "new");
  });

  it("prefers sold out over sale when stock is zero", () => {
    const badges = resolveProductCardBadges({
      price: 59,
      compareAtPrice: 90,
      stock: 0,
      createdAt: "2026-09-01T00:00:00.000Z",
      metadata: {},
      now,
    });

    assert.deepEqual(
      badges.map((badge) => badge.kind),
      ["sold_out"]
    );
  });

  it("respects manual badges up to two slots", () => {
    const badges = resolveProductCardBadges({
      price: 100,
      stock: 20,
      createdAt: "2020-01-01T00:00:00.000Z",
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "best_seller" }, { kind: "trending" }],
        },
      },
      now,
    });

    assert.deepEqual(
      badges.map((badge) => badge.kind),
      ["best_seller", "trending"]
    );
  });

  it("honors suppressAutoBadges for sale", () => {
    const badges = resolveProductCardBadges({
      price: 59,
      compareAtPrice: 90,
      stock: 10,
      createdAt: "2020-01-01T00:00:00.000Z",
      metadata: {
        merchandising: {
          manualBadges: [],
          suppressAutoBadges: ["sale"],
        },
      },
      now,
    });

    assert.equal(badges.length, 0);
  });

  it("shows sold out first when stock is zero even with two manual badges", () => {
    const badges = resolveProductCardBadges({
      price: 100,
      stock: 0,
      createdAt: "2020-01-01T00:00:00.000Z",
      metadata: {
        merchandising: {
          manualBadges: [{ kind: "best_seller" }, { kind: "trending" }],
        },
      },
      now,
    });

    assert.deepEqual(
      badges.map((badge) => badge.kind),
      ["sold_out", "best_seller"]
    );
  });

  it("adds best_seller when unitsSold meets threshold", () => {
    const badges = resolveProductCardBadges({
      price: 100,
      stock: 10,
      createdAt: "2020-01-01T00:00:00.000Z",
      unitsSold: 12,
      metadata: {},
      merchandisingConfig: { bestSellerMinUnitsSold: 5 },
      now,
    });

    assert.equal(badges[0]?.kind, "best_seller");
  });

  it("ignores negative unitsSold for auto best_seller", () => {
    const badges = resolveProductCardBadges({
      price: 100,
      stock: 10,
      createdAt: "2020-01-01T00:00:00.000Z",
      unitsSold: -3,
      metadata: {},
      merchandisingConfig: { bestSellerMinUnitsSold: 5 },
      now,
    });

    assert.equal(badges.length, 0);
  });
});

describe("productMerchandisingSchema", () => {
  it("strips auto-only kinds from manualBadges on parse", () => {
    const parsed = productMerchandisingSchema.parse({
      manualBadges: [{ kind: "sale" }, { kind: "trending" }],
    });

    assert.deepEqual(
      parsed.manualBadges.map((badge) => badge.kind),
      ["trending"]
    );
  });
});

describe("mergeMerchandisingPatch", () => {
  it("merges partial suppressAutoBadges without clearing manual badges", () => {
    const base = sanitizeProductMerchandising({
      manualBadges: [{ kind: "staff_pick" }],
      suppressAutoBadges: ["new"],
    });

    const merged = mergeMerchandisingPatch(base, {
      suppressAutoBadges: ["sale", "new"],
    });

    assert.deepEqual(
      merged.manualBadges.map((b) => b.kind),
      ["staff_pick"]
    );
    assert.deepEqual(merged.suppressAutoBadges, ["sale", "new"]);
  });
});

describe("sanitizeProductMerchandising", () => {
  it("drops manual kinds outside the site allowlist", () => {
    const result = sanitizeProductMerchandising(
      {
        manualBadges: [{ kind: "hot" }, { kind: "staff_pick" }],
      },
      { allowedManualKinds: ["staff_pick", "limited_offer"] }
    );

    assert.deepEqual(
      result.manualBadges.map((badge) => badge.kind),
      ["staff_pick"]
    );
  });

  it("keeps valid manual badges and drops auto-only kinds", () => {
    const result = sanitizeProductMerchandising({
      manualBadges: [
        { kind: "sale" },
        { kind: "trending" },
        { kind: "not_a_kind" },
      ],
      suppressAutoBadges: ["new", "invalid"],
    });

    assert.deepEqual(
      result.manualBadges.map((badge) => badge.kind),
      ["trending"]
    );
    assert.deepEqual(result.suppressAutoBadges, ["new"]);
  });
});

describe("getAutoProductBadgeRuleHintShort", () => {
  it("uses site merchandising thresholds and review flag", () => {
    assert.equal(
      getAutoProductBadgeRuleHintShort("low_stock", {
        config: { lowStockThreshold: 5 },
      }),
      "Stock ≤5"
    );
    assert.equal(
      getAutoProductBadgeRuleHintShort("new", {
        config: { newProductDays: 30 },
      }),
      "≤30 days"
    );
    assert.equal(
      getAutoProductBadgeRuleHintShort("top_rated", {
        config: { topRatedMinRating: 4.5, topRatedMinReviews: 10 },
        reviewsEnabled: true,
      }),
      "4.5+, 10+ reviews"
    );
    assert.equal(
      getAutoProductBadgeRuleHintShort("top_rated", {
        reviewsEnabled: false,
      }),
      "Reviews off on site"
    );
  });
});
