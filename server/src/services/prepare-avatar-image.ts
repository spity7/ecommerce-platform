import sharp from "sharp";
import {
  AVATAR_FORMATS_LABEL,
  AVATAR_MAX_BYTES,
  AVATAR_MAX_SIZE_LABEL,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";

const STORED_SHARP_FORMATS = new Set(["jpeg", "png", "webp"]);

export type PreparedAvatarImage = {
  buffer: Buffer;
  mimeType: string;
  extension: string;
};

function mimeAndExtensionForFormat(format: string): {
  mimeType: string;
  extension: string;
} {
  switch (format) {
    case "jpeg":
      return { mimeType: "image/jpeg", extension: "jpg" };
    case "png":
      return { mimeType: "image/png", extension: "png" };
    case "webp":
      return { mimeType: "image/webp", extension: "webp" };
    default:
      throw new AppError(400, `Profile photo must be ${AVATAR_FORMATS_LABEL}.`);
  }
}

function assertWithinSizeLimit(size: number): void {
  if (size > AVATAR_MAX_BYTES) {
    throw new AppError(
      400,
      `Profile photo must be ${AVATAR_MAX_SIZE_LABEL} or smaller.`
    );
  }
}

export async function prepareAvatarImage(
  buffer: Buffer
): Promise<PreparedAvatarImage> {
  if (!buffer.length) {
    throw new AppError(400, "No profile photo was uploaded.");
  }

  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(buffer).metadata();
  } catch {
    throw new AppError(400, `Profile photo must be ${AVATAR_FORMATS_LABEL}.`);
  }

  if (!metadata.format) {
    throw new AppError(400, `Profile photo must be ${AVATAR_FORMATS_LABEL}.`);
  }

  if (metadata.format === "heif") {
    const converted = await sharp(buffer)
      .rotate()
      .webp({ quality: 85 })
      .toBuffer();

    assertWithinSizeLimit(converted.length);

    return {
      buffer: converted,
      mimeType: "image/webp",
      extension: "webp",
    };
  }

  if (!STORED_SHARP_FORMATS.has(metadata.format)) {
    throw new AppError(400, `Profile photo must be ${AVATAR_FORMATS_LABEL}.`);
  }

  assertWithinSizeLimit(buffer.length);

  const { mimeType, extension } = mimeAndExtensionForFormat(metadata.format);

  return {
    buffer,
    mimeType,
    extension,
  };
}
