import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveProductCardBadges } from "@platform/shared";

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
});
