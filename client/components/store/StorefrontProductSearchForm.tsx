"use client";

import StorefrontProductSearchField from "@/components/store/StorefrontProductSearchField";
import { buildShopCatalogHref, createShopCatalogQuery } from "@/lib/shop-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StorefrontProductSearchFormProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onSubmitted?: () => void;
};

export default function StorefrontProductSearchForm({
  className = "rbt-search-form",
  inputClassName = "search-input",
  placeholder = "What Are You Looking For?",
  onSubmitted,
}: StorefrontProductSearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <StorefrontProductSearchField
      className={className}
      fieldWrapperClassName="input-section position-relative w-100 mr--12 mr_sm--4"
      inputClassName={inputClassName}
      placeholder={placeholder}
      productDetailsPath="/product"
      value={query}
      onChange={setQuery}
      onSubmitted={onSubmitted}
      onSubmitSearch={(search) => {
        router.push(
          buildShopCatalogHref(
            createShopCatalogQuery({
              page: 1,
              search: search || undefined,
            })
          )
        );
      }}
    />
  );
}
