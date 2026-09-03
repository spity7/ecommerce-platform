import path from "node:path";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { prepareAvatarImage } from "./prepare-avatar-image.js";
import { uploadFile } from "./storage.service.js";

export { AVATAR_MAX_BYTES } from "@platform/shared";

type UploadUserAvatarInput = {
  buffer: Buffer;
  originalName: string;
  userId: string;
};

export async function uploadUserAvatar(
  input: UploadUserAvatarInput
): Promise<{ fileName: string; publicUrl: string }> {
  const prepared = await prepareAvatarImage(input.buffer);

  if (!env.gcs.isConfigured) {
    throw new AppError(
      503,
      "Profile photo uploads are unavailable until GCS is configured."
    );
  }

  const baseName =
    path.parse(input.originalName).name.replace(/[^\w.-]/g, "_") || "avatar";
  const fileStem = `${input.userId}-${Date.now()}-${baseName}.${prepared.extension}`;
  const folder = `avatars/${input.userId}`;

  return uploadFile(prepared.buffer, fileStem, {
    folder,
    contentType: prepared.mimeType,
  });
}
