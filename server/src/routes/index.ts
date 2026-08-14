import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { uploadFile } from "../services/storage.service.js";
import { healthRouter } from "./health.routes.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);

apiRouter.post("/uploads", upload.single("file"), async (req, res, next) => {
  try {
    if (!env.gcs.isConfigured) {
      throw new AppError(
        503,
        "File uploads are unavailable until GCS is configured."
      );
    }

    if (!req.file) {
      throw new AppError(400, "No file uploaded. Use field name 'file'.");
    }

    const folder =
      typeof req.body.folder === "string" ? req.body.folder : undefined;

    const result = await uploadFile(req.file.buffer, req.file.originalname, {
      folder,
      contentType: req.file.mimetype,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
