import { getGcsBucket } from "../config/gcs.js";
import { AppError } from "../middleware/errorHandler.js";

type UploadFileOptions = {
  folder?: string;
  contentType?: string;
};

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  options: UploadFileOptions = {}
): Promise<{ fileName: string; publicUrl: string }> {
  const bucket = getGcsBucket();
  const safeName = originalName.replace(/[^\w.-]/g, "_");
  const folder = options.folder?.replace(/^\/+|\/+$/g, "");
  const fileName = folder
    ? `${folder}/${Date.now()}-${safeName}`
    : `${Date.now()}-${safeName}`;

  const file = bucket.file(fileName);

  await file.save(buffer, {
    contentType: options.contentType,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return { fileName, publicUrl };
}

export async function deleteFile(fileName: string): Promise<void> {
  const bucket = getGcsBucket();
  const file = bucket.file(fileName);
  const [exists] = await file.exists();

  if (!exists) {
    throw new AppError(404, "File not found");
  }

  await file.delete();
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
