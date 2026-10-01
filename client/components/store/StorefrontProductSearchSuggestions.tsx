"use client";

import { formatCurrency } from "@/lib/price";
import type { ProductSearchSuggestion } from "@/lib/product-search-suggestions";
import Image from "next/image";

type StorefrontProductSearchSuggestionsProps = {
  activeIndex: number;
  isLoading: boolean;
  listId: string;
  onSelect: (suggestion: ProductSearchSuggestion) => void;
  query: string;
  suggestions: ProductSearchSuggestion[];
};

export default function StorefrontProductSearchSuggestions({
  activeIndex,
  isLoading,
  listId,
  onSelect,
  query,
  suggestions,
}: StorefrontProductSearchSuggestionsProps) {
  const trimmedQuery = query.trim();

  return (
    <div className="rbt-product-search-suggestions" id={listId} role="listbox">
      {isLoading && suggestions.length === 0 ? (
        <p className="rbt-product-search-suggestions__status" role="status">
          Searching…
        </p>
      ) : null}
      {!isLoading && suggestions.length === 0 && trimmedQuery.length >= 2 ? (
        <p className="rbt-product-search-suggestions__status" role="status">
          No products match &ldquo;{trimmedQuery}&rdquo;
        </p>
      ) : null}
      {suggestions.map((suggestion, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={suggestion.slug}
            aria-selected={isActive}
            className={`rbt-product-search-suggestions__option${
              isActive ? " is-active" : ""
            }`}
            id={`${listId}-option-${index}`}
            role="option"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(suggestion)}
          >
            <span className="rbt-product-search-suggestions__thumb">
              <Image alt="" height={44} src={suggestion.image} width={44} />
            </span>
            <span className="rbt-product-search-suggestions__copy">
              <span className="rbt-product-search-suggestions__name">
                {suggestion.name}
              </span>
              {suggestion.categoryName ? (
                <span className="rbt-product-search-suggestions__meta">
                  {suggestion.categoryName}
                </span>
              ) : null}
            </span>
            <span className="rbt-product-search-suggestions__price">
              {formatCurrency(suggestion.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
