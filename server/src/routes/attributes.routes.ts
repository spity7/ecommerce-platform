import { Router } from "express";
import {
  createAttributeSchema,
  listQuerySchema,
  updateAttributeSchema,
} from "@platform/shared";
import { AppError } from "../middleware/errorHandler.js";
import { Attribute } from "../models/Attribute.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isUniqueKeyError, toAttributeDto } from "../utils/serializers.js";
import { slugify } from "../utils/strings.js";

export const attributesRouter = Router();

attributesRouter.get(
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
      Attribute.find(filter).sort({ name: 1 }).skip(skip).limit(query.limit),
      Attribute.countDocuments(filter),
    ]);

    res.json({
      data: items.map(toAttributeDto),
      total,
      page: query.page,
      limit: query.limit,
    });
  })
);

attributesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      throw new AppError(404, "Attribute not found");
    }
    res.json(toAttributeDto(attribute));
  })
);

attributesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = createAttributeSchema.parse(req.body);
    const slug = payload.slug ?? slugify(payload.name);

    try {
      const attribute = await Attribute.create({ ...payload, slug });
      res.status(201).json(toAttributeDto(attribute));
    } catch (error) {
      if (isUniqueKeyError(error)) {
        throw new AppError(409, "Attribute slug already exists");
      }
      throw error;
    }
  })
);

attributesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const payload = updateAttributeSchema.parse(req.body);
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      throw new AppError(404, "Attribute not found");
    }

    if (payload.name && !payload.slug) {
      payload.slug = slugify(payload.name);
    }

    Object.assign(attribute, payload);
    await attribute.save();
    res.json(toAttributeDto(attribute));
  })
);

attributesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute) {
      throw new AppError(404, "Attribute not found");
    }
    res.status(204).send();
  })
);
