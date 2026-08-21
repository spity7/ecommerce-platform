import { Router } from "express";
import {
  createCategorySchema,
  listQuerySchema,
  updateCategorySchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { Category } from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isUniqueKeyError, toCategoryDto } from "../utils/serializers.js";
import { slugify } from "../utils/strings.js";

export const categoriesRouter = Router();

categoriesRouter.get(
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
      Category.find(filter).sort({ name: 1 }).skip(skip).limit(query.limit),
      Category.countDocuments(filter),
    ]);

    res.json({
      data: items.map(toCategoryDto),
      total,
      page: query.page,
      limit: query.limit,
    });
  })
);

categoriesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.json(toCategoryDto(category));
  })
);

categoriesRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = createCategorySchema.parse(req.body);
    const slug = payload.slug ?? slugify(payload.name);

    try {
      const category = await Category.create({ ...payload, slug });
      res.status(201).json(toCategoryDto(category));
    } catch (error) {
      if (isUniqueKeyError(error)) {
        throw new AppError(409, "Category slug already exists");
      }
      throw error;
    }
  })
);

categoriesRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = updateCategorySchema.parse(req.body);
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (payload.name && !payload.slug) {
      payload.slug = slugify(payload.name);
    }

    Object.assign(category, payload);
    await category.save();
    res.json(toCategoryDto(category));
  })
);

categoriesRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    res.status(204).send();
  })
);
