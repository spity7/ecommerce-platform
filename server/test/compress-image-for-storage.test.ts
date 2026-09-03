import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  GCS_IMAGE_COMPRESS_MAX_BYTES,
  GCS_IMAGE_COMPRESS_MIN_BYTES,
  GCS_IMAGE_COMPRESS_THRESHOLD_BYTES,
} from "@platform/shared";
import { compressImageForStorage } from "../src/services/compress-image-for-storage.js";

const SMALL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

describe("compressImageForStorage", () => {
  it("returns null for images at or below the compression threshold", async () => {
    const result = await compressImageForStorage(SMALL_PNG);
    assert.equal(result, null);
  });

  it("returns null for non-image buffers", async () => {
    const result = await compressImageForStorage(
      Buffer.from("plain-text-not-an-image")
    );
    assert.equal(result, null);
  });

  it("compresses large images into the 400 KB to 800 KB range", async () => {
    const largeImage = await sharp({
      create: {
        width: 2000,
        height: 2000,
        channels: 3,
        background: { r: 128, g: 128, b: 128 },
        noise: {
          type: "gaussian",
          mean: 128,
          sigma: 30,
        },
      },
    })
      .jpeg({ quality: 100 })
      .toBuffer();

    assert.ok(largeImage.length > GCS_IMAGE_COMPRESS_THRESHOLD_BYTES);

    const result = await compressImageForStorage(largeImage);

    assert.ok(result);
    assert.equal(result.contentType, "image/webp");
    assert.equal(result.extension, "webp");
    assert.ok(result.buffer.length <= GCS_IMAGE_COMPRESS_MAX_BYTES);
    assert.ok(result.buffer.length >= GCS_IMAGE_COMPRESS_MIN_BYTES);
  });

  it("compresses images slightly above the 800 KB limit", async () => {
    const slightlyLargeWebp = await sharp({
      create: {
        width: 1400,
        height: 1400,
        channels: 3,
        background: { r: 128, g: 128, b: 128 },
        noise: {
          type: "gaussian",
          mean: 128,
          sigma: 30,
        },
      },
    })
      .webp({ quality: 100 })
      .toBuffer();

    assert.ok(slightlyLargeWebp.length > GCS_IMAGE_COMPRESS_THRESHOLD_BYTES);

    const result = await compressImageForStorage(slightlyLargeWebp);

    assert.ok(result);
    assert.ok(result.buffer.length <= GCS_IMAGE_COMPRESS_MAX_BYTES);
  });
});
