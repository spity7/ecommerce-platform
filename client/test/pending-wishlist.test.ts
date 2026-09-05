import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

const storage = new Map<string, string>();

function installSessionStorageMock(): void {
  globalThis.sessionStorage = {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return [...storage.keys()][index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  } as Storage;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: globalThis,
  });
}

describe("pending wishlist queue", () => {
  beforeEach(() => {
    storage.clear();
    installSessionStorageMock();
  });

  it("queues multiple unique products without duplicates", async () => {
    const {
      stashPendingWishlistProduct,
      consumePendingWishlistProducts,
      getPendingWishlistProductCount,
    } = await import("../lib/pending-wishlist");

    stashPendingWishlistProduct({
      id: "alpha",
      apiProductId: "id-alpha",
      title: "Alpha",
      price: 10,
      imgSrc: "/a.webp",
    });
    stashPendingWishlistProduct({
      id: "beta",
      apiProductId: "id-beta",
      title: "Beta",
      price: 20,
      imgSrc: "/b.webp",
    });
    stashPendingWishlistProduct({
      id: "alpha",
      apiProductId: "id-alpha",
      title: "Alpha",
      price: 10,
      imgSrc: "/a.webp",
    });

    assert.equal(getPendingWishlistProductCount(), 2);

    const pending = consumePendingWishlistProducts();
    assert.equal(pending.length, 2);
    assert.deepEqual(pending.map((item) => item.apiProductId).sort(), [
      "id-alpha",
      "id-beta",
    ]);
    assert.equal(getPendingWishlistProductCount(), 0);
  });

  it("migrates legacy single pending product storage", async () => {
    storage.set(
      "pending-wishlist-product",
      JSON.stringify({
        id: "legacy",
        apiProductId: "legacy-id",
        title: "Legacy",
        price: 5,
        imgSrc: "/legacy.webp",
      })
    );

    const { consumePendingWishlistProducts } =
      await import("../lib/pending-wishlist");

    const pending = consumePendingWishlistProducts();
    assert.equal(pending.length, 1);
    assert.equal(pending[0]?.apiProductId, "legacy-id");
    assert.equal(storage.get("pending-wishlist-product"), undefined);
  });
});
