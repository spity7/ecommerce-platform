import sharp from "sharp";
import {
  GCS_IMAGE_COMPRESS_MAX_BYTES,
  GCS_IMAGE_COMPRESS_MIN_BYTES,
  GCS_IMAGE_COMPRESS_THRESHOLD_BYTES,
} from "@platform/shared";

export type CompressedImageForStorage = {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
};

const MIN_RESIZE_WIDTH = 256;

function replaceFileExtension(fileName: string, extension: string): string {
  const normalizedExtension = extension.startsWith(".")
    ? extension
    : `.${extension}`;

  if (/\.[^./\\]+$/.test(fileName)) {
    return fileName.replace(/\.[^./\\]+$/, normalizedExtension);
  }

  return `${fileName}${normalizedExtension}`;
}

export { replaceFileExtension };

export async function compressImageForStorage(
  buffer: Buffer
): Promise<CompressedImageForStorage | null> {
  if (buffer.length <= GCS_IMAGE_COMPRESS_THRESHOLD_BYTES) {
    return null;
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(buffer, { failOn: "none" }).metadata();
  } catch {
    return null;
  }

  if (!metadata.format || metadata.format === "svg") {
    return null;
  }

  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  if (!originalWidth || !originalHeight) {
    return null;
  }

  const compressed = await compressImageToStorageRange(
    buffer,
    originalWidth,
    originalHeight
  );

  return {
    buffer: compressed,
    contentType: "image/webp",
    extension: "webp",
  };
}

async function compressImageToStorageRange(
  buffer: Buffer,
  originalWidth: number,
  originalHeight: number
): Promise<Buffer> {
  let targetWidth = originalWidth;

  while (targetWidth >= MIN_RESIZE_WIDTH) {
    const resized = sharp(buffer)
      .rotate()
      .resize({
        width: targetWidth,
        height: Math.max(
          1,
          Math.round((originalHeight / originalWidth) * targetWidth)
        ),
        fit: "inside",
        withoutEnlargement: true,
      });

    const candidate = await findBestWebpBuffer(resized);
    if (candidate) {
      return candidate;
    }

    targetWidth = Math.floor(targetWidth * 0.85);
  }

  return forceCompressToMax(
    sharp(buffer).rotate().resize({
      width: MIN_RESIZE_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    })
  );
}

async function findBestWebpBuffer(input: sharp.Sharp): Promise<Buffer | null> {
  let bestInRange: Buffer | null = null;
  let bestUnderMax: Buffer | null = null;

  let low = 1;
  let high = 100;

  while (low <= high) {
    const quality = Math.floor((low + high) / 2);
    const candidate = await input.clone().webp({ quality }).toBuffer();

    if (candidate.length > GCS_IMAGE_COMPRESS_MAX_BYTES) {
      high = quality - 1;
      continue;
    }

    bestUnderMax = candidate;

    if (candidate.length >= GCS_IMAGE_COMPRESS_MIN_BYTES) {
      bestInRange = candidate;
      low = quality + 1;
      continue;
    }

    low = quality + 1;
  }

  if (bestInRange && bestInRange.length <= GCS_IMAGE_COMPRESS_MAX_BYTES) {
    return bestInRange;
  }

  if (bestUnderMax && bestUnderMax.length <= GCS_IMAGE_COMPRESS_MAX_BYTES) {
    return bestUnderMax;
  }

  return null;
}

async function forceCompressToMax(input: sharp.Sharp): Promise<Buffer> {
  for (const quality of [80, 60, 40, 20, 10, 1]) {
    const candidate = await input.clone().webp({ quality }).toBuffer();
    if (candidate.length <= GCS_IMAGE_COMPRESS_MAX_BYTES) {
      return candidate;
    }
  }

  throw new Error("Unable to compress image below the GCS storage limit.");
}
