import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("wishlist mutation queue", () => {
  it("serializes mutations and tracks pending count", async () => {
    const {
      getPendingWishlistMutationCount,
      queueWishlistMutation,
    } = await import("../lib/wishlist-sync");

    assert.equal(getPendingWishlistMutationCount(), 0);

    const order: string[] = [];

    const first = queueWishlistMutation(async () => {
      order.push("first-start");
      await new Promise((resolve) => setTimeout(resolve, 20));
      order.push("first-end");
      return [];
    });

    const second = queueWishlistMutation(async () => {
      order.push("second-start");
      order.push("second-end");
      return [];
    });

    assert.equal(getPendingWishlistMutationCount(), 2);

    await Promise.all([first, second]);

    assert.equal(getPendingWishlistMutationCount(), 0);
    assert.deepEqual(order, [
      "first-start",
      "first-end",
      "second-start",
      "second-end",
    ]);
  });
});
