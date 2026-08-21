import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import {
  attributeDtoSchema,
  authResponseSchema,
  brandDtoSchema,
  categoryDtoSchema,
  createAttributeSchema,
  createBrandSchema,
  createCategorySchema,
  createProductSchema,
  errorResponseSchema,
  healthResponseSchema,
  listQuerySchema,
  loginSchema,
  paginatedAttributesSchema,
  paginatedBrandsSchema,
  paginatedCategoriesSchema,
  paginatedProductsSchema,
  productDtoSchema,
  refreshTokenSchema,
  registerSchema,
  updateAttributeSchema,
  updateBrandSchema,
  updateCategorySchema,
  updateProductSchema,
  uploadResponseSchema,
  userDtoSchema,
  validationErrorResponseSchema,
  cartDtoSchema,
  cartItemInputSchema,
  updateCartItemSchema,
  mergeCartSchema,
  orderDtoSchema,
  paginatedOrdersSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  updateUserProfileSchema,
} from "@platform/shared";
import { z } from "@platform/shared/zod";

export const openApiRegistry = new OpenAPIRegistry();

const idParamSchema = z.object({
  id: z.string().openapi({ description: "Resource ID" }),
});

const itemIdParamSchema = z.object({
  itemId: z.string().openapi({ description: "Cart item ID" }),
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
openApiRegistry.register("UserDto", userDtoSchema);
openApiRegistry.register("AuthResponse", authResponseSchema);
openApiRegistry.register("LoginInput", loginSchema);
openApiRegistry.register("RegisterInput", registerSchema);
openApiRegistry.register("RefreshTokenInput", refreshTokenSchema);
openApiRegistry.register("CartDto", cartDtoSchema);
openApiRegistry.register("CartItemInput", cartItemInputSchema);
openApiRegistry.register("UpdateCartItemInput", updateCartItemSchema);
openApiRegistry.register("MergeCartInput", mergeCartSchema);
openApiRegistry.register("OrderDto", orderDtoSchema);
openApiRegistry.register("PaginatedOrders", paginatedOrdersSchema);
openApiRegistry.register("CreateOrderInput", createOrderSchema);
openApiRegistry.register("UpdateOrderStatusInput", updateOrderStatusSchema);
openApiRegistry.register("UpdateUserProfileInput", updateUserProfileSchema);
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
  method: "post",
  path: "/api/auth/login",
  tags: ["Auth"],
  operationId: "login",
  summary: "Login with email and password",
  request: {
    body: {
      content: { "application/json": { schema: loginSchema } },
    },
  },
  responses: {
    200: {
      description: "Authenticated",
      content: { "application/json": { schema: authResponseSchema } },
    },
    401: {
      description: "Invalid credentials",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/auth/register",
  tags: ["Auth"],
  operationId: "register",
  summary: "Register a customer account",
  request: {
    body: {
      content: { "application/json": { schema: registerSchema } },
    },
  },
  responses: {
    201: {
      description: "Registered",
      content: { "application/json": { schema: authResponseSchema } },
    },
    409: {
      description: "Email already registered",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/auth/refresh",
  tags: ["Auth"],
  operationId: "refreshToken",
  summary: "Refresh access token",
  request: {
    body: {
      content: { "application/json": { schema: refreshTokenSchema } },
    },
  },
  responses: {
    200: {
      description: "Token refreshed",
      content: { "application/json": { schema: authResponseSchema } },
    },
    401: {
      description: "Invalid refresh token",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/auth/me",
  tags: ["Auth"],
  operationId: "getMe",
  summary: "Get current user profile",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Current user",
      content: { "application/json": { schema: userDtoSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/auth/logout",
  tags: ["Auth"],
  operationId: "logout",
  summary: "Logout current user",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Logged out",
      content: {
        "application/json": {
          schema: z.object({ ok: z.boolean() }),
        },
      },
    },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/cart",
  tags: ["Cart"],
  operationId: "getCart",
  summary: "Get current cart",
  responses: {
    200: {
      description: "Cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/cart/items",
  tags: ["Cart"],
  operationId: "addCartItem",
  summary: "Add item to cart",
  request: {
    body: {
      content: { "application/json": { schema: cartItemInputSchema } },
    },
  },
  responses: {
    201: {
      description: "Updated cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/api/cart/items/{itemId}",
  tags: ["Cart"],
  operationId: "updateCartItem",
  summary: "Update cart item quantity",
  request: {
    params: itemIdParamSchema,
    body: {
      content: { "application/json": { schema: updateCartItemSchema } },
    },
  },
  responses: {
    200: {
      description: "Updated cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/api/cart/items/{itemId}",
  tags: ["Cart"],
  operationId: "removeCartItem",
  summary: "Remove cart item",
  request: { params: itemIdParamSchema },
  responses: {
    200: {
      description: "Updated cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "delete",
  path: "/api/cart",
  tags: ["Cart"],
  operationId: "clearCart",
  summary: "Clear cart",
  responses: {
    200: {
      description: "Empty cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/cart/merge",
  tags: ["Cart"],
  operationId: "mergeCart",
  summary: "Merge guest cart into user cart",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: mergeCartSchema } } },
  },
  responses: {
    200: {
      description: "Merged cart",
      content: { "application/json": { schema: cartDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "post",
  path: "/api/orders",
  tags: ["Orders"],
  operationId: "createOrder",
  summary: "Create order from cart",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createOrderSchema } } },
  },
  responses: {
    201: {
      description: "Order created",
      content: { "application/json": { schema: orderDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/orders",
  tags: ["Orders"],
  operationId: "listOrders",
  summary: "List orders",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Orders",
      content: { "application/json": { schema: paginatedOrdersSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "get",
  path: "/api/orders/{id}",
  tags: ["Orders"],
  operationId: "getOrder",
  summary: "Get order by ID",
  security: [{ bearerAuth: [] }],
  request: { params: idParamSchema },
  responses: {
    200: {
      description: "Order",
      content: { "application/json": { schema: orderDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/api/orders/{id}",
  tags: ["Orders"],
  operationId: "updateOrder",
  summary: "Update order status (admin)",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: {
      content: { "application/json": { schema: updateOrderStatusSchema } },
    },
  },
  responses: {
    200: {
      description: "Order",
      content: { "application/json": { schema: orderDtoSchema } },
    },
  },
});

openApiRegistry.registerPath({
  method: "patch",
  path: "/api/users/me",
  tags: ["Users"],
  operationId: "updateUserProfile",
  summary: "Update current user profile",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: updateUserProfileSchema } },
    },
  },
  responses: {
    200: {
      description: "User",
      content: { "application/json": { schema: userDtoSchema } },
    },
  },
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
        "REST API for the ecommerce platform catalog, auth, cart, orders, health, and uploads.",
    },
    servers: [{ url: "http://localhost:5000", description: "Local dev" }],
  });
}
