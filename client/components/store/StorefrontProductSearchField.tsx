"use client";

import StorefrontProductSearchSuggestions from "@/components/store/StorefrontProductSearchSuggestions";
import { useProductSearchSuggestions } from "@/hooks/useProductSearchSuggestions";
import {
  PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH,
  type ProductSearchSuggestion,
} from "@/lib/product-search-suggestions";
import {
  navigateStorefrontCatalogSearch,
  navigateStorefrontProduct,
  STOREFRONT_PRODUCT_DETAILS_PATH,
} from "@/lib/storefront-search-navigation";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

type StorefrontProductSearchLayout = "inline" | "headerDropdown";

type StorefrontProductSearchFieldProps = {
  className?: string;
  enableSuggestions?: boolean;
  fieldWrapperClassName?: string;
  inputClassName?: string;
  layout?: StorefrontProductSearchLayout;
  onChange: (value: string) => void;
  onSubmitted?: () => void;
  onSubmitSearch?: (query: string) => void;
  placeholder?: string;
  productDetailsPath?: string;
  scrollOnShopSearch?: boolean;
  submitOnSuggestionPick?: "product" | "shop";
  submitButtonLabel?: string;
  value: string;
};

export default function StorefrontProductSearchField({
  className = "rbt-inner-search-field style-one rbt-search-field-rounded",
  enableSuggestions = true,
  fieldWrapperClassName,
  inputClassName,
  layout = "inline",
  onChange,
  onSubmitted,
  onSubmitSearch,
  placeholder = "Search for products",
  productDetailsPath: _productDetailsPath = STOREFRONT_PRODUCT_DETAILS_PATH,
  scrollOnShopSearch = true,
  submitOnSuggestionPick = "product",
  submitButtonLabel = "Search",
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
    navigateStorefrontCatalogSearch(router, query, {
      scroll: scrollOnShopSearch,
    });
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
    navigateStorefrontProduct(router, suggestion.slug);
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

  const inputProps = {
    "aria-activedescendant": activeDescendant,
    "aria-autocomplete": "list" as const,
    "aria-controls": showSuggestionsPanel ? listId : undefined,
    "aria-expanded": showSuggestionsPanel,
    "aria-label": placeholder,
    autoComplete: "off" as const,
    className: inputClassName,
    placeholder,
    role: "combobox" as const,
    type: "search" as const,
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      setIsOpen(true);
    },
    onFocus: () => {
      if (trimmedValue.length >= PRODUCT_SEARCH_SUGGESTION_MIN_LENGTH) {
        setIsOpen(true);
      }
    },
    onKeyDown: handleKeyDown,
  };

  const suggestionsPanel = showSuggestionsPanel ? (
    <StorefrontProductSearchSuggestions
      activeIndex={activeIndex}
      isLoading={isLoading}
      listId={listId}
      query={value}
      suggestions={suggestions}
      onSelect={pickSuggestion}
    />
  ) : null;

  const inlineSearchButton = (
    <button
      aria-label="Search"
      className="rbt-round-btn search-btn"
      type="submit"
    >
      <i className="fa-solid fa-magnifying-glass" />
    </button>
  );

  return (
    <div
      ref={rootRef}
      className={`rbt-product-search-field position-relative w-100${
        showSuggestionsPanel ? " is-suggestions-open" : ""
      }${layout === "headerDropdown" ? " rbt-product-search-field--header-dropdown" : ""}`}
    >
      <form className={className} onSubmit={handleSubmit}>
        {layout === "headerDropdown" ? (
          <>
            <div className="input-section position-relative w-100 mr--12 mr_sm--4">
              <input {...inputProps} />
              <i
                aria-hidden="true"
                className="fa-sharp fa-regular inner-search-icon fa-magnifying-glass"
              />
              {suggestionsPanel}
            </div>
            <div className="submit-btn">
              <button className="rbt-btn btn-md" type="submit">
                {submitButtonLabel}
              </button>
            </div>
          </>
        ) : fieldWrapperClassName ? (
          <div className={fieldWrapperClassName}>
            <input {...inputProps} />
            {inlineSearchButton}
            {suggestionsPanel}
          </div>
        ) : (
          <>
            <input {...inputProps} />
            {inlineSearchButton}
          </>
        )}
      </form>
      {layout === "inline" && !fieldWrapperClassName ? suggestionsPanel : null}
    </div>
  );
}
