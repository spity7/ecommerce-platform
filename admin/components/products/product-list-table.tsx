"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/layout/icon";
import {
  ListClearFiltersButton,
  ListFilterSelect,
  ListSearchField,
} from "@/components/ui/list-filter-controls";
import { ListDeleteConfirmDialog } from "@/components/ui/list-delete-confirm-dialog";
import { CrudBusyShield } from "@/components/ui/crud-busy-shield";
import {
  ListTableBody,
  ListTableEmptyMessage,
} from "@/components/ui/list-table-body";
import { ListTablePagination } from "@/components/ui/list-table-pagination";
import {
  ADMIN_LIST_TABLE_PAGE_SIZE,
  clampListTablePage,
  listTablePageIndexForItem,
  sliceListTablePage,
} from "@/lib/list-table-pagination";
import { ProductListBadgeChips } from "@/components/products/product-list-badge-chips";
import {
  CatalogStatusBadge,
  ProductInventoryBadge,
} from "@/components/products/catalog-status-badge";
import { CatalogStatusFilterSelect } from "@/components/products/catalog-status-select";
import { routes } from "@/config/routes";
import { ADMIN_LIST_ROW_THUMB } from "@/lib/catalog-image-display";
import { productEditPath, storefrontProductPath } from "@/lib/paths";
import { StorefrontProductViewAction } from "@/components/ui/linked-products-view-action";
import { finishCatalogDelete } from "@/lib/catalog-feedback";
import { useToast } from "@/providers/toast-provider";
import { useCrudBusyLock } from "@/providers/crud-busy-provider";
import type { CatalogStatus, Product } from "@/data/products/data";
import { isAdminLowStock, isAdminOutOfStock } from "@/lib/product-stock";
import { deleteProductApi } from "@platform/api-client";
import { cn } from "@/utils/cn";

type SortKey = "name" | "price" | "status" | "stock";
type SortDirection = "asc" | "desc";

type CatalogFilterOption = {
  id: string;
  name: string;
};

type ProductListInitialFilters = {
  attributeSlug?: string;
  brandId?: string;
  categoryId?: string;
};

type StatusFilter = "all" | CatalogStatus | "low stock";

type ProductListTableProps = {
  attributeFilters: CatalogFilterOption[];
  brandFilters: CatalogFilterOption[];
  categoryFilters: CatalogFilterOption[];
  focusProductId?: string;
  initialFilters?: ProductListInitialFilters;
  lowStockThreshold: number;
  products: Product[];
};

function resolveInitialListFilter(
  value: string | undefined,
  options: CatalogFilterOption[]
): string {
  if (value && options.some((option) => option.id === value)) {
    return value;
  }
  return "all";
}

function productKey(product: Product): string {
  return product.id ?? product.sku;
}

export function ProductListTable({
  attributeFilters,
  brandFilters,
  categoryFilters,
  focusProductId,
  initialFilters = {},
  lowStockThreshold,
  products,
}: ProductListTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState(() =>
    resolveInitialListFilter(initialFilters.categoryId, categoryFilters)
  );
  const [brandId, setBrandId] = useState(() =>
    resolveInitialListFilter(initialFilters.brandId, brandFilters)
  );
  const [attributeSlug, setAttributeSlug] = useState(() =>
    resolveInitialListFilter(initialFilters.attributeSlug, attributeFilters)
  );
  const [sort, setSort] = useState<{ direction: SortDirection; key: SortKey }>({
    direction: "asc",
    key: "name",
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [rows, setRows] = useState(products);
  const [highlightProductId, setHighlightProductId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRows(products);
  }, [products]);

  useCrudBusyLock(deleting);

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: "all" },
      ...categoryFilters.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [categoryFilters]
  );

  const brandOptions = useMemo(
    () => [
      { label: "All brands", value: "all" },
      ...brandFilters.map((brand) => ({
        label: brand.name,
        value: brand.id,
      })),
    ],
    [brandFilters]
  );

  const attributeOptions = useMemo(
    () => [
      { label: "All attributes", value: "all" },
      ...attributeFilters.map((attribute) => ({
        label: attribute.name,
        value: attribute.id,
      })),
    ],
    [attributeFilters]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = rows.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.sku} ${product.category} ${product.brand ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      const catalogStatus = product.catalogStatus ?? product.status;
      const matchesStatus =
        status === "all" ||
        (status === "low stock"
          ? isAdminLowStock(catalogStatus, product.stock, lowStockThreshold)
          : catalogStatus === status);
      const matchesCategory =
        categoryId === "all" || product.categoryId === categoryId;
      const matchesBrand = brandId === "all" || product.brandId === brandId;
      const matchesAttribute =
        attributeSlug === "all" ||
        (product.attributeSlugs?.includes(attributeSlug) ?? false);
      return (
        matchesQuery &&
        matchesStatus &&
        matchesCategory &&
        matchesBrand &&
        matchesAttribute
      );
    });

    return [...filtered].sort((a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;
      if (sort.key === "price" || sort.key === "stock") {
        return (a[sort.key] - b[sort.key]) * direction;
      }

      return String(a[sort.key]).localeCompare(String(b[sort.key])) * direction;
    });
  }, [
    attributeSlug,
    brandId,
    categoryId,
    lowStockThreshold,
    query,
    rows,
    sort,
    status,
  ]);

  useEffect(() => {
    setPage(1);
  }, [query, status, categoryId, brandId, attributeSlug, sort]);

  const safePage = clampListTablePage(
    page,
    filteredProducts.length,
    ADMIN_LIST_TABLE_PAGE_SIZE
  );

  const pagedProducts = useMemo(
    () =>
      sliceListTablePage(
        filteredProducts,
        safePage,
        ADMIN_LIST_TABLE_PAGE_SIZE
      ),
    [filteredProducts, safePage]
  );

  const filterSignature = useMemo(
    () =>
      JSON.stringify({
        attributeSlug,
        brandId,
        categoryId,
        query: query.trim(),
        sort,
        status,
      }),
    [attributeSlug, brandId, categoryId, query, sort, status]
  );

  const rowSetToken = useMemo(
    () => pagedProducts.map((product) => productKey(product)).join("|"),
    [pagedProducts]
  );

  useEffect(() => {
    const id = focusProductId?.trim();
    if (!id) {
      return;
    }

    const itemIndex = filteredProducts.findIndex(
      (product) => productKey(product) === id
    );
    if (itemIndex < 0) {
      return;
    }

    setPage(listTablePageIndexForItem(itemIndex, ADMIN_LIST_TABLE_PAGE_SIZE));
    setHighlightProductId(id);
    requestAnimationFrame(() => {
      document
        .getElementById(`product-row-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const clearHighlight = window.setTimeout(() => {
      setHighlightProductId(null);
    }, 4500);

    const params = new URLSearchParams(searchParams.toString());
    if (params.has("productId")) {
      params.delete("productId");
      const queryString = params.toString();
      router.replace(
        queryString ? `${routes.products}?${queryString}` : routes.products,
        { scroll: false }
      );
    }

    return () => {
      window.clearTimeout(clearHighlight);
    };
  }, [filteredProducts, focusProductId, router, searchParams]);

  const allVisibleSelected =
    pagedProducts.length > 0 &&
    pagedProducts.every((product) => selected.has(productKey(product)));

  function toggleSort(key: SortKey) {
    setSort((current) => ({
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
      key,
    }));
  }

  function toggleSelected(product: Product, checked: boolean) {
    const key = productKey(product);
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const product of pagedProducts) {
        const key = productKey(product);
        if (checked) {
          next.add(key);
        } else {
          next.delete(key);
        }
      }
      return next;
    });
  }

  async function confirmDelete() {
    const ids = Array.from(selected);
    setDeleting(true);
    setDeleteError(null);
    try {
      await Promise.all(ids.map((id) => deleteProductApi(id)));
      setRows((current) =>
        current.filter((product) => !selected.has(productKey(product)))
      );
      setSelected(new Set());
      setConfirmOpen(false);
      await finishCatalogDelete({
        count: ids.length,
        entity: "product",
        router,
        showToast,
      });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const hasActiveFilters =
    query.trim().length > 0 ||
    categoryId !== "all" ||
    brandId !== "all" ||
    attributeSlug !== "all" ||
    status !== "all";

  function clearAllFilters() {
    setQuery("");
    setCategoryId("all");
    setBrandId("all");
    setAttributeSlug("all");
    setStatus("all");
    router.replace(routes.products);
  }

  const selectedLabels = rows
    .filter((product) => selected.has(productKey(product)))
    .map((product) => product.name);

  return (
    <section className="min-w-0 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <CrudBusyShield active={deleting}>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:contents">
              <ListSearchField
                className="min-w-0 w-full md:w-[200px]"
                label="Search products"
                onChange={setQuery}
                placeholder="Search products"
                value={query}
              />
              <button
                aria-label={`Delete ${selected.size} selected product${selected.size === 1 ? "" : "s"}`}
                className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-base bg-danger-500 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-danger-600 disabled:cursor-not-allowed disabled:opacity-50 md:hidden"
                disabled={selected.size === 0 || deleting}
                onClick={() => setConfirmOpen(true)}
                type="button"
              >
                <Icon className="h-4 w-4" name="trash-2" />
                <span className="tabular-nums">({selected.size})</span>
              </button>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3 md:contents">
              <ListFilterSelect
                ariaLabel="Filter by category"
                className="min-w-0 w-full md:w-[180px]"
                defaultValue="all"
                onValueChange={setCategoryId}
                options={categoryOptions}
                size="lg"
                value={categoryId}
              />
              <ListFilterSelect
                ariaLabel="Filter by brand"
                className="min-w-0 w-full md:w-[180px]"
                defaultValue="all"
                onValueChange={setBrandId}
                options={brandOptions}
                size="lg"
                value={brandId}
              />
              <ListFilterSelect
                ariaLabel="Filter by attribute"
                className="min-w-0 w-full md:w-[180px]"
                defaultValue="all"
                onValueChange={setAttributeSlug}
                options={attributeOptions}
                size="lg"
                value={attributeSlug}
              />
              <CatalogStatusFilterSelect
                className="min-w-0 w-full md:w-[160px]"
                onValueChange={(value) => setStatus(value as StatusFilter)}
                value={status}
              />
              <ListClearFiltersButton
                active={hasActiveFilters}
                onClear={clearAllFilters}
              />
            </div>
          </div>
          <button
            aria-label={`Delete ${selected.size} selected product${selected.size === 1 ? "" : "s"}`}
            className="max-md:hidden md:inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-base bg-danger-500 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-danger-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={selected.size === 0 || deleting}
            onClick={() => setConfirmOpen(true)}
            type="button"
          >
            <Icon className="h-4 w-4" name="trash-2" />
            <span className="tabular-nums">({selected.size})</span>
          </button>
        </div>

        <div className="admin-entity-table-scroll dashboard-scrollbar min-w-0 max-w-full overflow-x-auto">
          <table className="w-full min-w-0 text-left">
            <thead>
              <tr className="border-b border-surface-line text-[13px] uppercase text-ink-400">
                <th className="w-10 pb-3 pr-3">
                  <input
                    aria-label="Select all"
                    checked={allVisibleSelected}
                    className="h-4 w-4 cursor-pointer rounded border-surface-line text-brand-600 focus:ring-brand-600"
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                    type="checkbox"
                  />
                </th>
                <th className="pb-3 pr-4 font-semibold">
                  <SortButton label="Product" name="name" onSort={toggleSort} />
                </th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">
                  <SortButton label="Price" name="price" onSort={toggleSort} />
                </th>
                <th className="pb-3 pr-4 font-semibold">
                  <SortButton label="Stock" name="stock" onSort={toggleSort} />
                </th>
                <th className="w-[7.25rem] pb-3 pr-4 font-semibold">Badges</th>
                <th className="pb-3 pr-4 font-semibold">
                  <SortButton
                    label="Status"
                    name="status"
                    onSort={toggleSort}
                  />
                </th>
                <th className="entity-table-actions-col w-[8.25rem] min-w-[8.25rem] max-w-[8.25rem] whitespace-nowrap px-2 pb-3 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <ListTableBody
              className="text-[14px]"
              filterSignature={filterSignature}
              page={safePage}
              rowSetToken={rowSetToken}
            >
              {pagedProducts.map((product) => {
                const key = productKey(product);
                const isHighlighted =
                  highlightProductId !== null && highlightProductId === key;
                const catalogStatus = product.catalogStatus ?? product.status;
                const outOfStock = isAdminOutOfStock(product.stock);
                const lowStock = isAdminLowStock(
                  catalogStatus,
                  product.stock,
                  lowStockThreshold
                );

                return (
                  <tr
                    className={cn(
                      "border-b border-surface-line hover:bg-surface-body/70",
                      isHighlighted &&
                        "bg-brand-50 ring-2 ring-inset ring-brand-300"
                    )}
                    id={product.id ? `product-row-${product.id}` : undefined}
                    key={key}
                  >
                    <td className="py-4 pr-3">
                      <input
                        aria-label={`Select ${product.name}`}
                        checked={selected.has(productKey(product))}
                        className="h-4 w-4 cursor-pointer rounded border-surface-line text-brand-600 focus:ring-brand-600"
                        onChange={(event) =>
                          toggleSelected(product, event.target.checked)
                        }
                        type="checkbox"
                      />
                    </td>
                    <td className="min-w-0 py-4 pr-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Image
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-base bg-surface-body object-cover"
                          src={product.image}
                          {...ADMIN_LIST_ROW_THUMB}
                        />
                        <div className="min-w-0">
                          <Link
                            className="block truncate font-semibold text-ink-900 hover:text-brand-600"
                            href={productEditPath(String(product.id))}
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 text-[13px] text-ink-400">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      {product.categoryId && product.category ? (
                        <span className="text-ink-700">{product.category}</span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-ink-700">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 pr-4">
                      {outOfStock || lowStock ? (
                        <ProductInventoryBadge
                          stock={product.stock}
                          variant={outOfStock ? "out" : "low"}
                        />
                      ) : (
                        <span className="tabular-nums text-[14px] text-ink-700">
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="w-[7.25rem] py-4 pr-4 align-middle">
                      <ProductListBadgeChips badges={product.badges} />
                    </td>
                    <td className="py-4 pr-4">
                      <CatalogStatusBadge status={catalogStatus} />
                    </td>
                    <td className="entity-table-actions-col w-[8.25rem] min-w-[8.25rem] max-w-[8.25rem] whitespace-nowrap px-2 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {product.slug &&
                        product.catalogStatus === "published" ? (
                          <StorefrontProductViewAction
                            disabled={deleting}
                            href={storefrontProductPath(product.slug)}
                          />
                        ) : (
                          <button
                            aria-label="Storefront preview unavailable for draft or archived products"
                            className="icon-button cursor-not-allowed opacity-40"
                            disabled
                            title="Publish to preview on the storefront"
                            type="button"
                          >
                            <Icon className="h-4 w-4" name="store" />
                          </button>
                        )}
                        {deleting ? (
                          <button
                            aria-label="Edit product"
                            className="icon-button disabled:cursor-not-allowed disabled:opacity-60"
                            disabled
                            type="button"
                          >
                            <Icon className="h-4 w-4" name="pencil" />
                          </button>
                        ) : (
                          <Link
                            aria-label="Edit product"
                            className="icon-button hover:bg-brand-50 hover:text-brand-600"
                            href={productEditPath(String(product.id))}
                          >
                            <Icon className="h-4 w-4" name="pencil" />
                          </Link>
                        )}
                        <button
                          aria-label="Delete product"
                          className="icon-button hover:bg-danger-50 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deleting}
                          onClick={() => {
                            setSelected(new Set([productKey(product)]));
                            setConfirmOpen(true);
                          }}
                          type="button"
                        >
                          <Icon className="h-4 w-4" name="trash-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </ListTableBody>
          </table>
        </div>

        {filteredProducts.length === 0 ? (
          <ListTableEmptyMessage filterSignature={filterSignature}>
            No products match your search.
          </ListTableEmptyMessage>
        ) : null}

        <ListTablePagination
          disabled={deleting}
          itemLabel="products"
          onPageChange={setPage}
          page={safePage}
          totalItems={filteredProducts.length}
        />
      </CrudBusyShield>

      {confirmOpen ? (
        <ListDeleteConfirmDialog
          count={selected.size}
          entityName="product"
          error={deleteError}
          itemLabels={selectedLabels}
          loading={deleting}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => void confirmDelete()}
          open={confirmOpen}
        />
      ) : null}
    </section>
  );
}

type SortButtonProps = {
  label: string;
  name: SortKey;
  onSort: (key: SortKey) => void;
};

function SortButton({ label, name, onSort }: SortButtonProps) {
  return (
    <button
      className="inline-flex cursor-pointer items-center gap-1 uppercase hover:text-ink-700"
      onClick={() => onSort(name)}
      type="button"
    >
      {label} <Icon className="h-3.5 w-3.5" name="chevrons-up-down" />
    </button>
  );
}
