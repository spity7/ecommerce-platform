import { Router } from "express";
import {
  createBrandSchema,
  listQuerySchema,
  updateBrandSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { Brand } from "../models/Brand.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isUniqueKeyError, toBrandDto } from "../utils/serializers.js";
import { getInitials, slugify } from "../utils/strings.js";

export const brandsRouter = Router();

brandsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" };
    }

    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      Brand.find(filter).sort({ name: 1 }).skip(skip).limit(query.limit),
      Brand.countDocuments(filter),
    ]);

    res.json({
      data: items.map(toBrandDto),
      total,
      page: query.page,
      limit: query.limit,
    });
  })
);

brandsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      throw new AppError(404, "Brand not found");
    }
    res.json(toBrandDto(brand));
  })
);

brandsRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = createBrandSchema.parse(req.body);
    const slug = payload.slug ?? slugify(payload.name);
    const initials = payload.initials ?? getInitials(payload.name);

    try {
      const brand = await Brand.create({ ...payload, slug, initials });
      res.status(201).json(toBrandDto(brand));
    } catch (error) {
      if (isUniqueKeyError(error)) {
        throw new AppError(409, "Brand slug already exists");
      }
      throw error;
    }
  })
);

brandsRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = updateBrandSchema.parse(req.body);
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      throw new AppError(404, "Brand not found");
    }

    if (payload.name && !payload.slug) {
      payload.slug = slugify(payload.name);
    }
    if (payload.name && !payload.initials) {
      payload.initials = getInitials(payload.name);
    }

    Object.assign(brand, payload);
    await brand.save();
    res.json(toBrandDto(brand));
  })
);

brandsRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      throw new AppError(404, "Brand not found");
    }
    res.status(204).send();
  })
);
