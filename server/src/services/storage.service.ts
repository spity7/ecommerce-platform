import { GCS_IMAGE_COMPRESS_MAX_BYTES } from "@platform/shared";
import { getGcsBucket } from "../config/gcs.js";
import { AppError } from "../middleware/errorHandler.js";
import { rethrowMappedGcsError } from "../utils/gcs-errors.js";
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
  const compressed = await compressImageForStorage(buffer);
  const uploadBuffer = compressed?.buffer ?? buffer;
  const contentType = compressed?.contentType ?? options.contentType;

  if (compressed && uploadBuffer.length > GCS_IMAGE_COMPRESS_MAX_BYTES) {
    throw new Error("Compressed image exceeds the GCS storage size limit.");
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
