import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getManagedAvatarObjectPath } from "../src/utils/managed-avatar-path.js";

describe("getManagedAvatarObjectPath", () => {
  const bucketName = "beauty_station";
  const userId = "6a945a5ffcaed4a8e1598b57";

  it("returns the object path for avatars stored in the configured bucket", () => {
    const avatarUrl = `https://storage.googleapis.com/${bucketName}/avatars/${userId}/1788207250218-avatar.webp`;

    assert.equal(
      getManagedAvatarObjectPath(avatarUrl, bucketName, userId),
      `avatars/${userId}/1788207250218-avatar.webp`
    );
  });

  it("returns null for external avatar URLs", () => {
    assert.equal(
      getManagedAvatarObjectPath(
        "https://example.com/google-avatar.jpg",
        bucketName,
        userId
      ),
      null
    );
  });

  it("returns null for avatars owned by another user", () => {
    const avatarUrl = `https://storage.googleapis.com/${bucketName}/avatars/other-user/1788207250218-avatar.webp`;

    assert.equal(
      getManagedAvatarObjectPath(avatarUrl, bucketName, userId),
      null
    );
  });

  it("returns null for objects outside the avatars folder", () => {
    const avatarUrl = `https://storage.googleapis.com/${bucketName}/products/image.webp`;

    assert.equal(
      getManagedAvatarObjectPath(avatarUrl, bucketName, userId),
      null
    );
  });
});
