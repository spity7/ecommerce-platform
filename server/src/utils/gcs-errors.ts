import { AppError } from "../middleware/errorHandler.js";

type GcsLikeError = {
  code?: number;
  message?: string;
};

function isGcsLikeError(error: unknown): error is GcsLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as GcsLikeError).code === "number"
  );
}

export function rethrowMappedGcsError(error: unknown): never {
  if (!isGcsLikeError(error)) {
    throw error;
  }

  if (error.code === 403) {
    throw new AppError(
      503,
      "File storage is unavailable: the configured GCS service account does not have permission to upload to this bucket. Grant it Storage Object Creator (or Storage Admin) on the bucket."
    );
  }

  if (error.code === 404) {
    throw new AppError(
      503,
      "File storage is unavailable: the configured GCS bucket or object was not found."
    );
  }

  throw error;
}
