import type { OrderStatus } from "@platform/shared";
import { ORDER_API_STATUSES } from "@/components/orders/order-status-select";
import type { ApiOrderRow } from "@/lib/mappers/orders";

function capitalizeStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export const ORDER_STATUS_FILTER_OPTIONS = [
  { label: "All statuses", match: () => true, value: "all" },
  ...ORDER_API_STATUSES.map((status) => ({
    label: capitalizeStatus(status),
    match: (row: ApiOrderRow) => row.apiStatus === status,
    value: status,
  })),
];

function formatUsdWhole(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function niceStep(range: number, targetBuckets: number): number {
  if (range <= 0) {
    return 1;
  }

  const rough = range / targetBuckets;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;

  let niceNormalized = 1;
  if (normalized > 5) {
    niceNormalized = 10;
  } else if (normalized > 2) {
    niceNormalized = 5;
  } else if (normalized > 1) {
    niceNormalized = 2;
  }

  return niceNormalized * magnitude;
}

function buildBreakPoints(min: number, max: number, maxBuckets = 4): number[] {
  if (max <= min) {
    return [min, max];
  }

  const step = niceStep(max - min, maxBuckets);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const breaks: number[] = [];

  for (let value = start; value <= end + step / 2; value += step) {
    breaks.push(Math.round(value * 100) / 100);
  }

  if (breaks.length < 2) {
    breaks.push(start + step);
  }

  return breaks;
}

type TotalFilterOption = {
  label: string;
  match: (row: ApiOrderRow) => boolean;
  value: string;
};

export function buildOrderTotalFilterOptions(
  orders: ApiOrderRow[]
): TotalFilterOption[] {
  const allOption: TotalFilterOption = {
    label: "All totals",
    match: () => true,
    value: "all",
  };

  const amounts = orders
    .map((order) => order.totalAmount)
    .filter((amount) => Number.isFinite(amount));

  if (amounts.length === 0) {
    return [allOption];
  }

  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  if (min === max) {
    return [
      allOption,
      {
        label: formatUsdWhole(min),
        match: (row) => row.totalAmount === min,
        value: `exact-${min}`,
      },
    ];
  }

  const breaks = buildBreakPoints(min, max);
  const rangeOptions: TotalFilterOption[] = [];

  for (let index = 0; index < breaks.length - 1; index += 1) {
    const lower = breaks[index];
    const upper = breaks[index + 1];
    const isLast = index === breaks.length - 2;
    const label = isLast
      ? `${formatUsdWhole(lower)}+`
      : `${formatUsdWhole(lower)} – ${formatUsdWhole(upper)}`;

    const match = isLast
      ? (row: ApiOrderRow) => row.totalAmount >= lower
      : (row: ApiOrderRow) =>
          row.totalAmount >= lower && row.totalAmount < upper;

    if (orders.some(match)) {
      rangeOptions.push({
        label,
        match,
        value: isLast ? `${lower}-plus` : `${lower}-${upper}`,
      });
    }
  }

  return rangeOptions.length > 0 ? [allOption, ...rangeOptions] : [allOption];
}

export function buildOrderTotalFilterGroup(orders: ApiOrderRow[]) {
  const options = buildOrderTotalFilterOptions(orders);
  const widestLabel = options.reduce(
    (longest, option) =>
      option.label.length > longest.length ? option.label : longest,
    "All totals"
  );

  return {
    ariaLabel: "Filter by order total",
    className: widestLabel.length > 14 ? "w-[200px]" : "w-[160px]",
    defaultValue: "all",
    key: "total",
    options,
  };
}
