import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { uploadFile } from "../services/storage.service.js";
import { attributesRouter } from "./attributes.routes.js";
import { authRouter } from "./auth.routes.js";
import { brandsRouter } from "./brands.routes.js";
import { categoriesRouter } from "./categories.routes.js";
import { healthRouter } from "./health.routes.js";
import { productsRouter } from "./products.routes.js";
import { cartRouter } from "./cart.routes.js";
import { ordersRouter } from "./orders.routes.js";
import { usersRouter } from "./users.routes.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/brands", brandsRouter);
apiRouter.use("/attributes", attributesRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/users", usersRouter);

apiRouter.post(
  "/uploads",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req, res, next) => {
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
  }
);
