import { platformApi, type ListProduct200 } from "@platform/api-client";
import axios from "axios";

export type ProductSearchSuggestion = {
  slug: string;
  name: string;
  image: string;
  price: number;
  categoryName?: string;
};

const DEFAULT_SUGGESTION_IMAGE =
  "/assets/images/product-img/beauty-product/beauty-product-st-05.webp";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 120;

type SuggestionSource = {
  slug: string;
  name: string;
  images: string[];
  price: number;
  categoryName?: string | null;
};

type CancellableProductListRequest = Promise<unknown> & {
  cancel?: () => void;
};

function mapDtoToSuggestion(
  product: SuggestionSource
): ProductSearchSuggestion {
  const image =
    product.images.find((item) => item.trim().length > 0) ??
    DEFAULT_SUGGESTION_IMAGE;

  return {
    slug: product.slug,
    name: product.name,
    image,
    price: product.price,
    categoryName: product.categoryName ?? undefined,
  };
}

export type ProductSearchSuggestionsRequest = {
  cancel: () => void;
  promise: Promise<ProductSearchSuggestion[] | null>;
};

export function requestProductSearchSuggestions(
  query: string,
  limit = 6
): ProductSearchSuggestionsRequest {
  const trimmed = query.trim().slice(0, MAX_QUERY_LENGTH);
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return {
      promise: Promise.resolve([]),
      cancel: () => {},
    };
  }

  const request = platformApi.listProduct({
    search: trimmed,
    limit,
    page: 1,
    status: "published",
  }) as CancellableProductListRequest;

  const promise = request
    .then((response) => {
      return (response as ListProduct200).data.map(mapDtoToSuggestion);
    })
    .catch((error: unknown) => {
      if (axios.isCancel(error)) {
        return null;
      }
      return [];
    });

  return {
    promise,
    cancel: () => request.cancel?.(),
  };
}

export function isProductSearchSuggestionsCancelled(
  result: ProductSearchSuggestion[] | null
): result is null {
  return result === null;
}

export const PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH = MIN_QUERY_LENGTH;

export const PRODUCT_SEARCH_SUGGESTION_DEBOUNCE_MS = 200;
