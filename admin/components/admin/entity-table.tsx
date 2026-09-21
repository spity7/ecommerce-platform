"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/layout/icon";
import {
  ListClearFiltersButton,
  ListFilterSelect,
  ListSearchField,
  listFilterSelectClassName,
} from "@/components/ui/list-filter-controls";
import { LinkedProductsViewAction } from "@/components/ui/linked-products-view-action";
import { ListDeleteConfirmDialog } from "@/components/ui/list-delete-confirm-dialog";
import { CrudBusyShield } from "@/components/ui/crud-busy-shield";
import {
  ListTableBody,
  ListTableEmptyMessage,
} from "@/components/ui/list-table-body";
import { ListTablePagination } from "@/components/ui/list-table-pagination";
import {
  ADMIN_LIST_TABLE_PAGE_SIZE,
  ADMIN_TABLE_ACTIONS_COL_WIDTH,
  clampListTablePage,
  sliceListTablePage,
} from "@/lib/list-table-pagination";
import { cn } from "@/utils/cn";
import { useCrudBusyLock } from "@/providers/crud-busy-provider";

export type EntityColumn<T> = {
  cellClassName?: string;
  colWidth?: string;
  headClassName?: string;
  headerTruncate?: boolean;
  hideable?: boolean;
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => number | string;
};

export type EntityTableRowActionHelpers = {
  requestDelete: (id: string) => void;
};

type FilterOption<T> = {
  label: string;
  match: (row: T) => boolean;
  value: string;
};

type FilterGroup<T> = {
  ariaLabel: string;
  className?: string;
  defaultValue: string;
  key: string;
  options: FilterOption<T>[];
};

type EntityTableProps<T extends { id: string }> = {
  columns: EntityColumn<T>[];
  deleteMessage?: string;
  editActionAriaLabel?: string | ((row: T) => string);
  editActionIcon?: string;
  editHref: string | ((row: T) => string);
  enableColumnToggle?: boolean;
  filterGroups?: FilterGroup<T>[];
  filterOptions?: FilterOption<T>[];
  filterOptionsAriaLabel?: string;
  /** When set, status-style `filterOptions` render before `filterGroups` (e.g. orders toolbar). */
  filterOptionsFirst?: boolean;
  renderFilterSelect?: (props: {
    defaultValue: string;
    onValueChange: (value: string) => void;
    value: string;
  }) => React.ReactNode;
  getRowLabel?: (row: T) => string;
  items: T[];
  onDelete?: (ids: string[]) => Promise<void>;
  renderRowActions?: (
    row: T,
    helpers: EntityTableRowActionHelpers
  ) => React.ReactNode;
  resolvePreflightDeleteError?: (ids: string[]) => string | null;
  rowActionsColWidth?: string;
  rowActionsHeaderLabel?: string;
  deleteButtonClassName?: string;
  filtersClassName?: string;
  searchFieldClassName?: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchText: (row: T) => string;
  singularName: string;
  tableClassName?: string;
  toolbarClassName?: string;
  viewHref?: string | ((row: T) => string);
  viewLinkedProductCount?: (row: T) => number;
};

type SortState = {
  direction: "asc" | "desc";
  key: string;
};

const TABLE_CELL_X = "px-4";
const TABLE_CHECKBOX_X = "px-3";
const TABLE_ACTIONS_X = "px-2";
const ENTITY_TABLE_ACTIONS_COL_CLASS =
  "entity-table-actions-col w-[8.25rem] min-w-[8.25rem] max-w-[8.25rem] whitespace-nowrap";

function resolveEntityTableActionsColWidth(
  rowActionsColWidth: string | undefined,
  options: {
    hasCustomRowActions: boolean;
    hasViewAction: boolean;
  }
): string {
  if (rowActionsColWidth) {
    return rowActionsColWidth;
  }

  if (options.hasCustomRowActions) {
    return "10rem";
  }

  return options.hasViewAction ? ADMIN_TABLE_ACTIONS_COL_WIDTH : "6.5rem";
}

function SortableColumnHeader({
  align = "left",
  label,
  onSort,
  truncateLabel = true,
}: {
  align?: "left" | "right";
  label: string;
  onSort: () => void;
  truncateLabel?: boolean;
}) {
  return (
    <button
      className={cn(
        "group inline-flex max-w-full items-center gap-1 border-0 bg-transparent p-0 font-semibold uppercase hover:text-ink-700",
        align === "right" && "ml-auto"
      )}
      onClick={onSort}
      type="button"
    >
      <span
        className={cn(
          "min-w-0 leading-tight",
          truncateLabel ? "truncate" : "whitespace-nowrap"
        )}
      >
        {label}
      </span>
      <Icon
        className="h-3.5 w-3.5 shrink-0 text-ink-300 group-hover:text-ink-500"
        name="chevrons-up-down"
      />
    </button>
  );
}

export function EntityTable<T extends { id: string }>({
  columns,
  deleteMessage,
  editActionAriaLabel,
  editActionIcon = "pencil",
  editHref,
  enableColumnToggle = false,
  filterGroups,
  filterOptions,
  filterOptionsAriaLabel = "Filter list",
  filterOptionsFirst = false,
  renderFilterSelect,
  getRowLabel,
  items,
  onDelete,
  renderRowActions,
  resolvePreflightDeleteError,
  rowActionsColWidth,
  rowActionsHeaderLabel = "Action",
  deleteButtonClassName,
  filtersClassName,
  searchFieldClassName,
  searchLabel,
  searchPlaceholder,
  searchText,
  singularName,
  tableClassName,
  toolbarClassName,
  viewHref,
  viewLinkedProductCount,
}: EntityTableProps<T>) {
  const router = useRouter();
  const sortableColumns = columns.filter((column) => column.sortValue);
  const hideableColumns = columns.filter((column) => column.hideable);
  const usesFixedTableLayout = columns.some((column) => column.colWidth);
  const resolvedActionsColWidth = resolveEntityTableActionsColWidth(
    rowActionsColWidth,
    {
      hasCustomRowActions: renderRowActions != null,
      hasViewAction: viewHref != null,
    }
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filterOptions?.[0]?.value ?? "all");
  const [groupFilters, setGroupFilters] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (filterGroups ?? []).map((group) => [group.key, group.defaultValue])
    )
  );
  const [rows, setRows] = useState(items);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({
    direction: "asc",
    key: sortableColumns[0]?.key ?? columns[0]?.key ?? "",
  });
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(hideableColumns.map((column) => column.key))
  );
  const [page, setPage] = useState(1);

  useCrudBusyLock(deleting);

  const defaultFilterValue = filterOptions?.[0]?.value ?? "all";

  useEffect(() => {
    setRows(items);
  }, [items]);

  useEffect(() => {
    setGroupFilters((current) => {
      let changed = false;
      const next = { ...current };

      for (const group of filterGroups ?? []) {
        const validValues = new Set(
          group.options.map((option) => option.value)
        );
        const selected = next[group.key] ?? group.defaultValue;

        if (!validValues.has(selected)) {
          next[group.key] = group.defaultValue;
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [filterGroups]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeFilter = filterOptions?.find(
      (option) => option.value === filter
    );
    const activeGroupFilters = (filterGroups ?? []).map((group) =>
      group.options.find((option) => option.value === groupFilters[group.key])
    );
    const sortColumn = columns.find((column) => column.key === sort.key);

    const next = rows.filter((row) => {
      const matchesQuery =
        !normalizedQuery ||
        searchText(row).toLowerCase().includes(normalizedQuery);
      const matchesFilter = !activeFilter || activeFilter.match(row);
      const matchesGroupFilters = activeGroupFilters.every(
        (option) => !option || option.match(row)
      );
      return matchesQuery && matchesFilter && matchesGroupFilters;
    });

    if (!sortColumn?.sortValue) {
      return next;
    }

    return [...next].sort((a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;
      const aValue = sortColumn.sortValue?.(a) ?? "";
      const bValue = sortColumn.sortValue?.(b) ?? "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction;
      }

      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [
    columns,
    filter,
    filterGroups,
    filterOptions,
    groupFilters,
    query,
    rows,
    searchText,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [query, filter, groupFilters, sort]);

  const safePage = clampListTablePage(
    page,
    filteredRows.length,
    ADMIN_LIST_TABLE_PAGE_SIZE
  );

  const pagedRows = useMemo(
    () =>
      sliceListTablePage(filteredRows, safePage, ADMIN_LIST_TABLE_PAGE_SIZE),
    [filteredRows, safePage]
  );

  const filterSignature = useMemo(
    () =>
      JSON.stringify({
        filter,
        groupFilters,
        query: query.trim(),
        sort,
      }),
    [filter, groupFilters, query, sort]
  );

  const rowSetToken = useMemo(
    () => pagedRows.map((row) => row.id).join("|"),
    [pagedRows]
  );

  const allVisibleSelected =
    pagedRows.length > 0 && pagedRows.every((row) => selected.has(row.id));

  function toggleSort(key: string) {
    setSort((current) => ({
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
      key,
    }));
  }

  function toggleSelected(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const row of pagedRows) {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      }
      return next;
    });
  }

  function openDeleteConfirm() {
    setDeleteError(null);
    setConfirmOpen(true);
  }

  function requestRowDelete(id: string) {
    setSelected(new Set([id]));
    openDeleteConfirm();
  }

  const rowActionHelpers: EntityTableRowActionHelpers = {
    requestDelete: requestRowDelete,
  };

  function closeDeleteConfirm() {
    setDeleteError(null);
    setConfirmOpen(false);
  }

  async function confirmDelete() {
    const ids = Array.from(selected);
    if (onDelete) {
      setDeleting(true);
      setDeleteError(null);
      try {
        await onDelete(ids);
        setRows((current) => current.filter((row) => !selected.has(row.id)));
        setSelected(new Set());
        closeDeleteConfirm();
      } catch (error) {
        setDeleteError(
          error instanceof Error ? error.message : "Delete failed"
        );
        router.refresh();
      } finally {
        setDeleting(false);
      }
      return;
    }
    setRows((current) => current.filter((row) => !selected.has(row.id)));
    setSelected(new Set());
    closeDeleteConfirm();
  }

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const preflightDeleteError =
    confirmOpen && resolvePreflightDeleteError
      ? resolvePreflightDeleteError(selectedIds)
      : null;

  const dialogDeleteError = deleteError ?? preflightDeleteError;
  const deleteBlocked = Boolean(preflightDeleteError);

  function resolveEditHref(row: T): string {
    return typeof editHref === "function" ? editHref(row) : editHref;
  }

  function resolveEditAriaLabel(row: T): string {
    if (typeof editActionAriaLabel === "function") {
      return editActionAriaLabel(row);
    }
    if (editActionAriaLabel) {
      return editActionAriaLabel;
    }
    return `Edit ${singularName}`;
  }

  function resolveViewHref(row: T): string | null {
    if (!viewHref) {
      return null;
    }
    return typeof viewHref === "function" ? viewHref(row) : viewHref;
  }

  function isColumnHidden(column: EntityColumn<T>) {
    return (
      enableColumnToggle &&
      column.hideable === true &&
      !visibleColumns.has(column.key)
    );
  }

  const hasActiveGroupFilters = (filterGroups ?? []).some(
    (group) => groupFilters[group.key] !== group.defaultValue
  );
  const hasActiveFilters =
    query.trim().length > 0 ||
    filter !== defaultFilterValue ||
    hasActiveGroupFilters;

  function clearAllFilters() {
    setQuery("");
    setFilter(defaultFilterValue);
    setGroupFilters(
      Object.fromEntries(
        (filterGroups ?? []).map((group) => [group.key, group.defaultValue])
      )
    );
  }

  function setGroupFilter(key: string, value: string) {
    setGroupFilters((current) => ({ ...current, [key]: value }));
  }

  const selectedLabels = rows
    .filter((row) => selected.has(row.id))
    .map((row) => getRowLabel?.(row) ?? row.id);

  const deleteToolbarButton = (visibilityClassName: string) =>
    onDelete ? (
      <button
        aria-label={`Delete ${selected.size} selected ${singularName}${selected.size === 1 ? "" : "s"}`}
        className={cn(
          "h-11 shrink-0 items-center justify-center gap-2 rounded-base bg-danger-500 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-danger-600 disabled:cursor-not-allowed disabled:opacity-50",
          visibilityClassName,
          deleteButtonClassName
        )}
        disabled={selected.size === 0 || deleting}
        onClick={openDeleteConfirm}
        type="button"
      >
        <Icon className="h-4 w-4 shrink-0" name="trash-2" />
        <span className="tabular-nums">({selected.size})</span>
      </button>
    ) : null;

  const groupFilterControls = filterGroups?.map((group) => (
    <ListFilterSelect
      ariaLabel={group.ariaLabel}
      className={group.className ?? listFilterSelectClassName()}
      defaultValue={group.defaultValue}
      key={group.key}
      onValueChange={(value) => setGroupFilter(group.key, value)}
      options={group.options}
      size="lg"
      value={groupFilters[group.key] ?? group.defaultValue}
    />
  ));

  const primaryFilterControl = filterOptions ? (
    renderFilterSelect ? (
      renderFilterSelect({
        defaultValue: defaultFilterValue,
        onValueChange: setFilter,
        value: filter,
      })
    ) : (
      <ListFilterSelect
        ariaLabel={filterOptionsAriaLabel}
        className={listFilterSelectClassName()}
        defaultValue={defaultFilterValue}
        onValueChange={setFilter}
        options={filterOptions}
        size="lg"
        value={filter}
      />
    )
  ) : null;

  const filterControls = (
    <>
      {filterOptionsFirst ? (
        <>
          {primaryFilterControl}
          {groupFilterControls}
        </>
      ) : (
        <>
          {groupFilterControls}
          {primaryFilterControl}
        </>
      )}
      <ListClearFiltersButton
        active={hasActiveFilters}
        onClear={clearAllFilters}
      />
      {enableColumnToggle && hideableColumns.length ? (
        <div className="relative col-span-2 md:col-span-1">
          <button
            aria-expanded={columnsOpen}
            aria-haspopup="true"
            className="inline-flex h-11 items-center gap-2 rounded-base border border-surface-line bg-surface-card px-4 text-[14px] font-semibold text-ink-700 transition-colors hover:bg-surface-muted"
            onClick={() => setColumnsOpen((current) => !current)}
            type="button"
          >
            <Icon className="h-4 w-4" name="sliders-horizontal" />
            Columns
          </button>
          {columnsOpen ? (
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-base border border-surface-line bg-surface-card p-2 shadow-card">
              <p className="px-2 py-1 text-[12px] font-semibold uppercase text-ink-400">
                Toggle columns
              </p>
              {hideableColumns.map((column) => (
                <label
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-[14px] text-ink-700 hover:bg-surface-muted"
                  key={column.key}
                >
                  <input
                    aria-label={`Toggle ${column.label} column`}
                    checked={visibleColumns.has(column.key)}
                    onChange={(event) => {
                      setVisibleColumns((current) => {
                        const next = new Set(current);
                        if (event.target.checked) {
                          next.add(column.key);
                        } else {
                          next.delete(column.key);
                        }
                        return next;
                      });
                    }}
                    type="checkbox"
                  />{" "}
                  {column.label}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );

  return (
    <section className="min-w-0 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
      <CrudBusyShield active={deleting}>
        <div
          className={cn(
            "mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
            toolbarClassName
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:contents">
              <ListSearchField
                className={cn(
                  "min-w-0 w-full md:w-[200px]",
                  searchFieldClassName
                )}
                label={searchLabel}
                onChange={setQuery}
                placeholder={searchPlaceholder}
                value={query}
              />
              {deleteToolbarButton("inline-flex max-md:px-3 md:hidden")}
            </div>
            <div
              className={cn(
                "grid min-w-0 grid-cols-2 gap-3 md:contents",
                filtersClassName
              )}
            >
              {filterControls}
            </div>
          </div>
          {deleteToolbarButton("max-md:hidden md:inline-flex shrink-0")}
        </div>

        <div className="admin-entity-table-scroll dashboard-scrollbar min-w-0 max-w-full overflow-x-auto">
          <table
            className={cn(
              "w-full min-w-0 text-left",
              usesFixedTableLayout && "table-fixed",
              tableClassName
            )}
          >
            {usesFixedTableLayout ? (
              <colgroup>
                <col style={{ width: "40px" }} />
                {columns.map((column) => {
                  if (isColumnHidden(column)) {
                    return null;
                  }
                  return (
                    <col
                      key={column.key}
                      style={
                        column.colWidth ? { width: column.colWidth } : undefined
                      }
                    />
                  );
                })}
                <col style={{ width: resolvedActionsColWidth }} />
              </colgroup>
            ) : null}
            <thead>
              <tr className="border-b border-surface-line text-[13px] uppercase text-ink-400">
                <th className={cn(TABLE_CHECKBOX_X, "pb-3 align-bottom")}>
                  <input
                    aria-label="Select all"
                    checked={allVisibleSelected}
                    className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                    type="checkbox"
                  />
                </th>
                {columns.map((column) => {
                  const hidden = isColumnHidden(column);
                  return (
                    <th
                      className={cn(
                        TABLE_CELL_X,
                        "min-w-0 pb-3 align-bottom font-semibold",
                        column.headClassName,
                        hidden ? "hidden" : ""
                      )}
                      key={column.key}
                    >
                      {column.sortValue ? (
                        <SortableColumnHeader
                          align={
                            column.headClassName?.includes("text-right")
                              ? "right"
                              : "left"
                          }
                          label={column.label}
                          onSort={() => toggleSort(column.key)}
                          truncateLabel={column.headerTruncate !== false}
                        />
                      ) : (
                        <span
                          className={cn(
                            "block",
                            column.headerTruncate !== false && "truncate",
                            column.headClassName?.includes("text-right")
                              ? "text-right"
                              : "text-left"
                          )}
                        >
                          {column.label}
                        </span>
                      )}
                    </th>
                  );
                })}
                <th
                  className={cn(
                    TABLE_ACTIONS_X,
                    ENTITY_TABLE_ACTIONS_COL_CLASS,
                    "pb-3 text-right align-bottom font-semibold"
                  )}
                >
                  {rowActionsHeaderLabel}
                </th>
              </tr>
            </thead>
            <ListTableBody
              className="text-[14px]"
              filterSignature={filterSignature}
              page={safePage}
              rowSetToken={rowSetToken}
            >
              {pagedRows.map((row) => (
                <tr
                  className="border-b border-surface-line hover:bg-surface-body/70"
                  key={row.id}
                >
                  <td className={cn(TABLE_CHECKBOX_X, "py-4 align-top")}>
                    <input
                      aria-label={`Select ${row.id}`}
                      checked={selected.has(row.id)}
                      className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={deleting}
                      onChange={(event) =>
                        toggleSelected(row.id, event.target.checked)
                      }
                      type="checkbox"
                    />
                  </td>
                  {columns.map((column) => {
                    const hidden = isColumnHidden(column);
                    return (
                      <td
                        className={cn(
                          TABLE_CELL_X,
                          "min-w-0 py-4 align-top text-ink-700",
                          column.cellClassName,
                          hidden ? "hidden" : ""
                        )}
                        key={column.key}
                      >
                        {column.render(row)}
                      </td>
                    );
                  })}
                  <td
                    className={cn(
                      TABLE_ACTIONS_X,
                      ENTITY_TABLE_ACTIONS_COL_CLASS,
                      "py-4 text-right align-top"
                    )}
                  >
                    {renderRowActions ? (
                      renderRowActions(row, rowActionHelpers)
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        {resolveViewHref(row) ? (
                          <LinkedProductsViewAction
                            count={viewLinkedProductCount?.(row) ?? 0}
                            disabled={deleting}
                            href={resolveViewHref(row)!}
                          />
                        ) : null}
                        {deleting ? (
                          <button
                            aria-label={resolveEditAriaLabel(row)}
                            className="icon-button disabled:cursor-not-allowed disabled:opacity-60"
                            disabled
                            type="button"
                          >
                            <Icon className="h-4 w-4" name={editActionIcon} />
                          </button>
                        ) : (
                          <Link
                            aria-label={resolveEditAriaLabel(row)}
                            className="icon-button hover:bg-brand-50 hover:text-brand-600"
                            href={resolveEditHref(row)}
                          >
                            <Icon className="h-4 w-4" name={editActionIcon} />
                          </Link>
                        )}
                        <button
                          aria-label={`Delete ${singularName}`}
                          className="icon-button hover:bg-danger-50 hover:text-danger-500 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deleting}
                          onClick={() => requestRowDelete(row.id)}
                          type="button"
                        >
                          <Icon className="h-4 w-4" name="trash-2" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </ListTableBody>
          </table>
        </div>

        {filteredRows.length === 0 ? (
          <ListTableEmptyMessage filterSignature={filterSignature}>
            No {singularName}s match your search.
          </ListTableEmptyMessage>
        ) : null}

        <ListTablePagination
          disabled={deleting}
          itemLabel={`${singularName}s`}
          onPageChange={setPage}
          page={safePage}
          totalItems={filteredRows.length}
        />
      </CrudBusyShield>

      {confirmOpen ? (
        <ListDeleteConfirmDialog
          count={selected.size}
          deleteMessage={deleteMessage}
          entityName={singularName}
          error={dialogDeleteError}
          itemLabels={selectedLabels}
          loading={deleting}
          onClose={closeDeleteConfirm}
          onConfirm={() => void confirmDelete()}
          open={confirmOpen}
          deleteBlocked={deleteBlocked}
        />
      ) : null}
    </section>
  );
}
