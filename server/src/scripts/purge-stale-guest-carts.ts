import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Cart } from "../models/Cart.js";
import {
  GUEST_CART_WITH_ITEMS_TTL_MS,
  GUEST_EMPTY_CART_TTL_MS,
} from "../services/cart-guest-retention.js";

const DEFAULT_BATCH_LIMIT = 5000;

function parseArgs(argv: string[]) {
  const dryRun = argv.includes("--dry-run");
  const limitArg = argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg
    ? Number.parseInt(limitArg.split("=")[1] ?? "", 10)
    : DEFAULT_BATCH_LIMIT;

  if (!Number.isFinite(limit) || limit < 1) {
    throw new Error("--limit must be a positive integer");
  }

  return { dryRun, limit };
}

async function purgeStaleGuestCarts() {
  const { dryRun, limit } = parseArgs(process.argv.slice(2));
  await connectDatabase();

  const now = Date.now();
  const emptyCutoff = new Date(now - GUEST_EMPTY_CART_TTL_MS);
  const withItemsCutoff = new Date(now - GUEST_CART_WITH_ITEMS_TTL_MS);

  const emptyFilter = {
    guestSessionId: { $exists: true, $type: "string" as const },
    userId: { $exists: false },
    items: { $size: 0 },
    updatedAt: { $lt: emptyCutoff },
  };

  const withItemsFilter = {
    guestSessionId: { $exists: true, $type: "string" as const },
    userId: { $exists: false },
    "items.0": { $exists: true },
    updatedAt: { $lt: withItemsCutoff },
  };

  const [emptyCount, withItemsCount] = await Promise.all([
    Cart.countDocuments(emptyFilter),
    Cart.countDocuments(withItemsFilter),
  ]);

  console.log(
    `Stale guest carts (updated before retention window): empty=${emptyCount}, withItems=${withItemsCount}, dryRun=${dryRun}, limit=${limit}`
  );

  if (dryRun) {
    await disconnectDatabase();
    return;
  }

  const emptyIds = await Cart.find(emptyFilter)
    .select("_id")
    .limit(limit)
    .lean();
  const withItemsIds = await Cart.find(withItemsFilter)
    .select("_id")
    .limit(limit)
    .lean();

  const emptyResult =
    emptyIds.length > 0
      ? await Cart.deleteMany({ _id: { $in: emptyIds.map((row) => row._id) } })
      : { deletedCount: 0 };
  const withItemsResult =
    withItemsIds.length > 0
      ? await Cart.deleteMany({
          _id: { $in: withItemsIds.map((row) => row._id) },
        })
      : { deletedCount: 0 };

  console.log(
    `Deleted empty=${emptyResult.deletedCount ?? 0}, withItems=${withItemsResult.deletedCount ?? 0}`
  );

  await disconnectDatabase();
}

purgeStaleGuestCarts().catch(async (error) => {
  console.error("Guest cart purge failed:", error);
  await disconnectDatabase();
  process.exit(1);
});
