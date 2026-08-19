import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  attributeDtoSchema,
  brandDtoSchema,
  categoryDtoSchema,
  createAttributeSchema,
  createBrandSchema,
  createCategorySchema,
  createProductSchema,
  errorResponseSchema,
  healthResponseSchema,
  listQuerySchema,
  paginatedAttributesSchema,
  paginatedBrandsSchema,
  paginatedCategoriesSchema,
  paginatedProductsSchema,
  productDtoSchema,
  updateAttributeSchema,
  updateBrandSchema,
  updateCategorySchema,
  updateProductSchema,
  uploadResponseSchema,
  validationErrorResponseSchema,
} from "@platform/shared";
import { z } from "@platform/shared/zod";

export const openApiRegistry = new OpenAPIRegistry();

const idParamSchema = z.object({
  id: z.string().openapi({ description: "Resource ID" }),
});

openApiRegistry.register("ProductDto", productDtoSchema);
openApiRegistry.register("CategoryDto", categoryDtoSchema);
openApiRegistry.register("BrandDto", brandDtoSchema);
openApiRegistry.register("AttributeDto", attributeDtoSchema);
openApiRegistry.register("CreateProductInput", createProductSchema);
openApiRegistry.register("UpdateProductInput", updateProductSchema);
openApiRegistry.register("CreateCategoryInput", createCategorySchema);
openApiRegistry.register("UpdateCategoryInput", updateCategorySchema);
openApiRegistry.register("CreateBrandInput", createBrandSchema);
openApiRegistry.register("UpdateBrandInput", updateBrandSchema);
openApiRegistry.register("CreateAttributeInput", createAttributeSchema);
openApiRegistry.register("UpdateAttributeInput", updateAttributeSchema);
openApiRegistry.register("ListQuery", listQuerySchema);
openApiRegistry.register("PaginatedProducts", paginatedProductsSchema);
openApiRegistry.register("PaginatedCategories", paginatedCategoriesSchema);
openApiRegistry.register("PaginatedBrands", paginatedBrandsSchema);
openApiRegistry.register("PaginatedAttributes", paginatedAttributesSchema);
openApiRegistry.register("HealthResponse", healthResponseSchema);
openApiRegistry.register("UploadResponse", uploadResponseSchema);
openApiRegistry.register("ErrorResponse", errorResponseSchema);
openApiRegistry.register(
  "ValidationErrorResponse",
  validationErrorResponseSchema
);

function registerCrudPaths(options: {
  tag: string;
  basePath: string;
  dtoSchema: z.ZodType;
  paginatedSchema: z.ZodType;
  createSchema: z.ZodType;
  updateSchema: z.ZodType;
  resourceName: string;
}) {
  const {
    tag,
    basePath,
    dtoSchema,
    paginatedSchema,
    createSchema,
    updateSchema,
    resourceName,
  } = options;

  openApiRegistry.registerPath({
    method: "get",
    path: basePath,
    tags: [tag],
    operationId: `list${resourceName}`,
    summary: `List ${resourceName.toLowerCase()}s`,
    request: { query: listQuerySchema },
    responses: {
      200: {
        description: "Paginated list",
        content: { "application/json": { schema: paginatedSchema } },
      },
    },
  });

  openApiRegistry.registerPath({
    method: "post",
    path: basePath,
    tags: [tag],
    operationId: `create${resourceName}`,
    summary: `Create ${resourceName.toLowerCase()}`,
    request: {
      body: {
        content: { "application/json": { schema: createSchema } },
      },
    },
    responses: {
      201: {
        description: "Created",
        content: { "application/json": { schema: dtoSchema } },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": { schema: validationErrorResponseSchema },
        },
      },
      409: {
        description: "Conflict",
        content: { "application/json": { schema: errorResponseSchema } },
      },
    },
  });

  openApiRegistry.registerPath({
    method: "get",
    path: `${basePath}/{id}`,
    tags: [tag],
    operationId: `get${resourceName}`,
    summary: `Get ${resourceName.toLowerCase()} by ID`,
    request: { params: idParamSchema },
    responses: {
      200: {
        description: "Resource found",
        content: { "application/json": { schema: dtoSchema } },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: errorResponseSchema } },
      },
    },
  });

  openApiRegistry.registerPath({
    method: "patch",
    path: `${basePath}/{id}`,
    tags: [tag],
    operationId: `update${resourceName}`,
    summary: `Update ${resourceName.toLowerCase()}`,
    request: {
      params: idParamSchema,
      body: {
        content: { "application/json": { schema: updateSchema } },
      },
    },
    responses: {
      200: {
        description: "Updated",
        content: { "application/json": { schema: dtoSchema } },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": { schema: validationErrorResponseSchema },
        },
      },
      404: {
        description: "Not found",
        content: { "application/json": { schema: errorResponseSchema } },
      },
      409: {
        description: "Conflict",
        content: { "application/json": { schema: errorResponseSchema } },
      },
    },
  });

  openApiRegistry.registerPath({
    method: "delete",
    path: `${basePath}/{id}`,
    tags: [tag],
    operationId: `delete${resourceName}`,
    summary: `Delete ${resourceName.toLowerCase()}`,
    request: { params: idParamSchema },
    responses: {
      204: { description: "Deleted" },
      404: {
        description: "Not found",
        content: { "application/json": { schema: errorResponseSchema } },
      },
    },
  });
}

registerCrudPaths({
  tag: "Products",
  basePath: "/api/products",
  dtoSchema: productDtoSchema,
  paginatedSchema: paginatedProductsSchema,
  createSchema: createProductSchema,
  updateSchema: updateProductSchema,
  resourceName: "Product",
});

registerCrudPaths({
  tag: "Categories",
  basePath: "/api/categories",
  dtoSchema: categoryDtoSchema,
  paginatedSchema: paginatedCategoriesSchema,
  createSchema: createCategorySchema,
  updateSchema: updateCategorySchema,
  resourceName: "Category",
});

registerCrudPaths({
  tag: "Brands",
  basePath: "/api/brands",
  dtoSchema: brandDtoSchema,
  paginatedSchema: paginatedBrandsSchema,
  createSchema: createBrandSchema,
  updateSchema: updateBrandSchema,
  resourceName: "Brand",
});

registerCrudPaths({
  tag: "Attributes",
  basePath: "/api/attributes",
  dtoSchema: attributeDtoSchema,
  paginatedSchema: paginatedAttributesSchema,
  createSchema: createAttributeSchema,
  updateSchema: updateAttributeSchema,
  resourceName: "Attribute",
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/health",
  tags: ["Health"],
  operationId: "getHealth",
  summary: "Health check",
  responses: {
    200: {
      description: "Service health",
      content: { "application/json": { schema: healthResponseSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/uploads",
  tags: ["Uploads"],
  operationId: "uploadFile",
  summary: "Upload a file to storage",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.string().openapi({ format: "binary" }),
            folder: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "File uploaded",
      content: { "application/json": { schema: uploadResponseSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: errorResponseSchema } },
    },
    503: {
      description: "Storage unavailable",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

export function createOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "Ecommerce Platform API",
      version: "1.0.0",
      description:
        "REST API for the ecommerce platform catalog, health, and uploads.",
    },
    servers: [{ url: "http://localhost:5000", description: "Local dev" }],
  });
}
