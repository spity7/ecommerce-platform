"use client";

import {
  isProductSearchSuggestionsCancelled,
  PRODUCT_SEARCH_SUGGESTION_DEBOUNCE_MS,
  PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH,
  requestProductSearchSuggestions,
  type ProductSearchSuggestion,
} from "@/lib/product-search-suggestions";
import { useEffect, useState } from "react";

type UseProductSearchSuggestionsOptions = {
  debounceMs?: number;
  enabled?: boolean;
  limit?: number;
  query: string;
};

type UseProductSearchSuggestionsResult = {
  isLoading: boolean;
  suggestions: ProductSearchSuggestion[];
};

export function useProductSearchSuggestions({
  debounceMs = PRODUCT_SEARCH_SUGGESTION_DEBOUNCE_MS,
  enabled = true,
  limit = 6,
  query,
}: UseProductSearchSuggestionsOptions): UseProductSearchSuggestionsResult {
  const [suggestions, setSuggestions] = useState<ProductSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    let cancelRequest = () => {};
    setIsLoading(true);

    const timeoutId = window.setTimeout(() => {
      const { cancel, promise } = requestProductSearchSuggestions(
        trimmed,
        limit
      );
      cancelRequest = cancel;

      void promise
        .then((nextSuggestions) => {
          if (
            cancelled ||
            isProductSearchSuggestionsCancelled(nextSuggestions)
          ) {
            return;
          }
          setSuggestions(nextSuggestions);
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      cancelRequest();
    };
  }, [debounceMs, enabled, limit, query]);

  return { isLoading, suggestions };
}
