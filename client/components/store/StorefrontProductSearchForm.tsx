"use client";

import StorefrontProductSearchField from "@/components/store/StorefrontProductSearchField";
import { STOREFRONT_PRODUCT_DETAILS_PATH } from "@/lib/storefront-search-navigation";
import { useState } from "react";

type StorefrontProductSearchFormProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onSubmitted?: () => void;
  scrollOnShopSearch?: boolean;
};

export default function StorefrontProductSearchForm({
  className = "rbt-search-form",
  inputClassName = "search-input",
  placeholder = "What Are You Looking For?",
  onSubmitted,
  scrollOnShopSearch = true,
}: StorefrontProductSearchFormProps) {
  const [query, setQuery] = useState("");

  return (
    <StorefrontProductSearchField
      className={className}
      inputClassName={inputClassName}
      layout="headerDropdown"
      placeholder={placeholder}
      productDetailsPath={STOREFRONT_PRODUCT_DETAILS_PATH}
      scrollOnShopSearch={scrollOnShopSearch}
      value={query}
      onChange={setQuery}
      onSubmitted={onSubmitted}
    />
  );
}
