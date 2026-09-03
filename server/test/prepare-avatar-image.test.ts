import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { prepareAvatarImage } from "../src/services/prepare-avatar-image.js";

const PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

describe("prepareAvatarImage", () => {
  it("accepts valid PNG images", async () => {
    const prepared = await prepareAvatarImage(PNG_BUFFER);

    assert.equal(prepared.mimeType, "image/png");
    assert.equal(prepared.extension, "png");
    assert.equal(prepared.buffer.equals(PNG_BUFFER), true);
  });

  it("rejects invalid image data", async () => {
    await assert.rejects(
      () => prepareAvatarImage(Buffer.from("not-an-image")),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /Profile photo must be/);
        return true;
      }
    );
  });

  it("converts HEIC images to WebP when supported", async (t) => {
    if (!sharp.format.heif?.input?.buffer) {
      t.skip("HEIF input is not supported in this sharp build");
    }

    let heicBuffer: Buffer;
    try {
      heicBuffer = await sharp(PNG_BUFFER)
        .heif({ compression: "av1" })
        .toBuffer();
    } catch {
      t.skip("HEIF output is not supported in this sharp build");
    }

    const prepared = await prepareAvatarImage(heicBuffer!);

    assert.equal(prepared.mimeType, "image/webp");
    assert.equal(prepared.extension, "webp");
    assert.ok(prepared.buffer.length > 0);
  });
});
