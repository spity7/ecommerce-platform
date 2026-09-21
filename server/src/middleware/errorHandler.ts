import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import {
  CATALOG_UPLOAD_MAX_BYTES,
  CATALOG_UPLOAD_MAX_LABEL,
} from "@platform/shared";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        error: `Image file is too large. Maximum upload size is ${CATALOG_UPLOAD_MAX_LABEL} (${CATALOG_UPLOAD_MAX_BYTES} bytes).`,
      });
      return;
    }

    res.status(400).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}
