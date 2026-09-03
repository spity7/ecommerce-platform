import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/middleware/errorHandler.js";
import { rethrowMappedGcsError } from "../src/utils/gcs-errors.js";

describe("rethrowMappedGcsError", () => {
  it("maps GCS 403 errors to a 503 AppError", () => {
    assert.throws(
      () =>
        rethrowMappedGcsError({
          code: 403,
          message: "storage.objects.create denied",
        }),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.statusCode, 503);
        assert.match(error.message, /does not have permission to upload/i);
        return true;
      }
    );
  });

  it("rethrows unknown errors unchanged", () => {
    const original = new Error("boom");
    assert.throws(() => rethrowMappedGcsError(original), original);
  });
});
