import { env } from "../config/env.js";
import { getManagedAvatarObjectPath } from "../utils/managed-avatar-path.js";
import { deleteFileIfExists } from "./storage.service.js";

export { getManagedAvatarObjectPath } from "../utils/managed-avatar-path.js";

export async function deleteManagedAvatarIfPresent(
  avatarUrl: string | undefined,
  userId: string
): Promise<void> {
  if (!avatarUrl || !env.gcs.isConfigured || !env.gcs.bucketName) {
    return;
  }

  const objectPath = getManagedAvatarObjectPath(
    avatarUrl,
    env.gcs.bucketName,
    userId
  );
  if (!objectPath) {
    return;
  }

  try {
    await deleteFileIfExists(objectPath);
  } catch (error) {
    console.error(`Failed to delete managed avatar ${objectPath}:`, error);
  }
}
