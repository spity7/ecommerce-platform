export const ADMIN_LIST_TABLE_PAGE_SIZE = 10;

/** Fits view + edit + delete icon actions without forcing horizontal scroll. */
export const ADMIN_TABLE_ACTIONS_COL_WIDTH = "8.25rem";

export function clampListTablePage(
  page: number,
  totalItems: number,
  pageSize: number = ADMIN_LIST_TABLE_PAGE_SIZE
): number {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.min(Math.max(1, page), totalPages);
}

export function sliceListTablePage<T>(
  items: T[],
  page: number,
  pageSize: number = ADMIN_LIST_TABLE_PAGE_SIZE
): T[] {
  if (items.length === 0) {
    return items;
  }

  const safePage = clampListTablePage(page, items.length, pageSize);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function listTablePageIndexForItem(
  itemIndex: number,
  pageSize: number = ADMIN_LIST_TABLE_PAGE_SIZE
): number {
  if (itemIndex < 0) {
    return 1;
  }
  return Math.floor(itemIndex / pageSize) + 1;
}
