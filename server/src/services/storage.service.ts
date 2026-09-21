import {
  CATALOG_UPLOAD_MAX_LABEL,
  CATALOG_UPLOAD_TIMEOUT_LABEL,
  CATALOG_UPLOAD_TIMEOUT_MS,
  GCS_IMAGE_COMPRESS_MAX_BYTES,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { getGcsBucket } from "../config/gcs.js";
import { rethrowMappedGcsError } from "../utils/gcs-errors.js";
import { runSerialized } from "../utils/run-serialized.js";
import { withTimeout } from "../utils/with-timeout.js";
import {
  compressImageForStorage,
  replaceFileExtension,
} from "./compress-image-for-storage.js";

type UploadFileOptions = {
  folder?: string;
  contentType?: string;
};

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  options: UploadFileOptions = {}
): Promise<{ fileName: string; publicUrl: string }> {
  const compressed = await runSerialized(() =>
    withTimeout(
      compressImageForStorage(buffer),
      CATALOG_UPLOAD_TIMEOUT_MS,
      `Image processing timed out after ${CATALOG_UPLOAD_TIMEOUT_LABEL}. Try a smaller file or fewer images at once.`
    )
  );
  const uploadBuffer = compressed?.buffer ?? buffer;
  const contentType = compressed?.contentType ?? options.contentType;

  if (compressed && uploadBuffer.length > GCS_IMAGE_COMPRESS_MAX_BYTES) {
    throw new AppError(
      413,
      `Image could not be compressed below the storage limit. Try a smaller source file (max upload ${CATALOG_UPLOAD_MAX_LABEL}).`
    );
  }

  const bucket = getGcsBucket();
  const safeName = (
    compressed
      ? replaceFileExtension(originalName, compressed.extension)
      : originalName
  ).replace(/[^\w.-]/g, "_");
  const folder = options.folder?.replace(/^\/+|\/+$/g, "");
  const fileName = folder
    ? `${folder}/${Date.now()}-${safeName}`
    : `${Date.now()}-${safeName}`;

  const file = bucket.file(fileName);

  try {
    await file.save(uploadBuffer, {
      contentType,
      resumable: false,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });
  } catch (error) {
    rethrowMappedGcsError(error);
  }

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return { fileName, publicUrl };
}

export async function deleteFile(fileName: string): Promise<void> {
  const deleted = await deleteFileIfExists(fileName);
  if (!deleted) {
    throw new AppError(404, "File not found");
  }
}

export async function deleteFileIfExists(fileName: string): Promise<boolean> {
  const bucket = getGcsBucket();
  const file = bucket.file(fileName);
  const [exists] = await file.exists();

  if (!exists) {
    return false;
  }

  try {
    await file.delete();
  } catch (error) {
    rethrowMappedGcsError(error);
  }

  return true;
}

export async function getSignedReadUrl(
  fileName: string,
  expiresInMinutes = 15
): Promise<string> {
  const bucket = getGcsBucket();
  const file = bucket.file(fileName);
  const [exists] = await file.exists();

  if (!exists) {
    throw new AppError(404, "File not found");
  }

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}
