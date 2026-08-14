import { Storage } from "@google-cloud/storage";
import { env } from "./env.js";

let storage: Storage | null = null;

export function getGcsClient(): Storage {
  if (!env.gcs.isConfigured) {
    throw new Error(
      "GCS is not configured. Set GCS_PROJECT_ID, GCS_BUCKET_NAME, and GCS_KEY_FILE.",
    );
  }

  if (!storage) {
    storage = new Storage({
      projectId: env.gcs.projectId,
      keyFilename: env.gcs.keyFile,
    });
  }

  return storage;
}

export function getGcsBucket() {
  return getGcsClient().bucket(env.gcs.bucketName!);
}
