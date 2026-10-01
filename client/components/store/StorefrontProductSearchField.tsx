"use client";

import StorefrontProductSearchSuggestions from "@/components/store/StorefrontProductSearchSuggestions";
import { useProductSearchSuggestions } from "@/hooks/useProductSearchSuggestions";
import {
  PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH,
  type ProductSearchSuggestion,
} from "@/lib/product-search-suggestions";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type StorefrontProductSearchFieldProps = {
  className?: string;
  enableSuggestions?: boolean;
  fieldWrapperClassName?: string;
  inputClassName?: string;
  onChange: (value: string) => void;
  onSubmitted?: () => void;
  onSubmitSearch?: (query: string) => void;
  placeholder?: string;
  productDetailsPath?: string;
  shopSearchPath?: string;
  submitOnSuggestionPick?: "product" | "shop";
  value: string;
};

export default function StorefrontProductSearchField({
  className = "rbt-inner-search-field style-one rbt-search-field-rounded",
  enableSuggestions = true,
  fieldWrapperClassName,
  inputClassName,
  onChange,
  onSubmitted,
  onSubmitSearch,
  placeholder = "Search for products",
  productDetailsPath = "/product",
  shopSearchPath = "/shop",
  submitOnSuggestionPick = "product",
  value,
}: StorefrontProductSearchFieldProps) {
  const router = useRouter();
  const listId = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedValue = value.trim();
  const suggestionsEnabled =
    enableSuggestions &&
    trimmedValue.length >= PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH;

  const { isLoading, suggestions } = useProductSearchSuggestions({
    enabled: suggestionsEnabled && isOpen,
    query: value,
  });

  const optionCount = suggestions.length;

  useEffect(() => {
    setActiveIndex(-1);
  }, [value, suggestions.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  function navigateToShopSearch(query: string) {
    const params = new URLSearchParams();
    if (query) {
      params.set("search", query);
    }
    const href =
      params.size > 0 ? `${shopSearchPath}?${params}` : shopSearchPath;
    router.push(href);
    onSubmitted?.();
  }

  function submitSearch(query = trimmedValue) {
    if (onSubmitSearch) {
      onSubmitSearch(query);
      onSubmitted?.();
      return;
    }
    navigateToShopSearch(query);
  }

  function pickSuggestion(suggestion: ProductSearchSuggestion) {
    setIsOpen(false);
    if (submitOnSuggestionPick === "shop") {
      submitSearch(suggestion.name);
      return;
    }
    router.push(`${productDetailsPath}/${suggestion.slug}`);
    onSubmitted?.();
  }

  function pickActiveOption() {
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      pickSuggestion(suggestions[activeIndex]);
      return true;
    }
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isOpen && pickActiveOption()) {
      return;
    }
    submitSearch(trimmedValue);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!enableSuggestions) {
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      if (optionCount === 0) {
        return;
      }
      setActiveIndex((current) => (current + 1) % optionCount);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen || optionCount === 0) {
        return;
      }
      setActiveIndex((current) =>
        current <= 0 ? optionCount - 1 : current - 1
      );
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      pickActiveOption();
    }
  }

  const showSuggestionsPanel =
    isOpen &&
    enableSuggestions &&
    trimmedValue.length >= PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH;

  const activeDescendant =
    activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <div
      ref={rootRef}
      className={`rbt-product-search-field position-relative w-100${
        showSuggestionsPanel ? " is-suggestions-open" : ""
      }`}
    >
      <form className={className} onSubmit={handleSubmit}>
        {fieldWrapperClassName ? (
          <div className={fieldWrapperClassName}>
            <input
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              aria-controls={showSuggestionsPanel ? listId : undefined}
              aria-expanded={showSuggestionsPanel}
              aria-label={placeholder}
              autoComplete="off"
              className={inputClassName}
              placeholder={placeholder}
              role="combobox"
              type="search"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (
                  trimmedValue.length >= PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH
                ) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              aria-label="Search"
              className="rbt-round-btn search-btn"
              type="submit"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
        ) : (
          <>
            <input
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              aria-controls={showSuggestionsPanel ? listId : undefined}
              aria-expanded={showSuggestionsPanel}
              aria-label={placeholder}
              autoComplete="off"
              className={inputClassName}
              placeholder={placeholder}
              role="combobox"
              type="search"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (
                  trimmedValue.length >= PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH
                ) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              aria-label="Search"
              className="rbt-round-btn search-btn"
              type="submit"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </>
        )}
      </form>
      {showSuggestionsPanel ? (
        <StorefrontProductSearchSuggestions
          activeIndex={activeIndex}
          isLoading={isLoading}
          listId={listId}
          query={value}
          suggestions={suggestions}
          onSelect={pickSuggestion}
        />
      ) : null}
    </div>
  );
}
