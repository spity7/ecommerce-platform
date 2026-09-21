export const GCS_IMAGE_STORAGE_KB = 1000;

export const GCS_IMAGE_COMPRESS_MAX_BYTES = 800 * GCS_IMAGE_STORAGE_KB;

export const GCS_IMAGE_COMPRESS_MIN_BYTES = 400 * GCS_IMAGE_STORAGE_KB;

export const GCS_IMAGE_COMPRESS_THRESHOLD_BYTES = GCS_IMAGE_COMPRESS_MAX_BYTES;

export const GCS_IMAGE_COMPRESS_MIN_LABEL = "400 KB";

export const GCS_IMAGE_COMPRESS_MAX_LABEL = "800 KB";

/** Long edge cap while compressing uploads (avoids multi-minute Sharp runs on huge photos). */
export const GCS_IMAGE_COMPRESS_MAX_DIMENSION = 2048;

/** Max size accepted by the catalog upload API (Multer) before compression. */
export const CATALOG_UPLOAD_MAX_BYTES = 20 * 1024 * 1024;

export const CATALOG_UPLOAD_MAX_LABEL = "20 MB";

/** Per-file upload + server-side compression budget (client axios + API). */
export const CATALOG_UPLOAD_TIMEOUT_MS = 3 * 60 * 1000;

export const CATALOG_UPLOAD_TIMEOUT_LABEL = "3 minutes";
