import { AdminProductBadgeChip } from "@/components/catalog/admin-product-badge-chip";
import type { ProductCardBadgeDto } from "@platform/shared";

export function ProductListBadgeChips({
  badges,
}: {
  badges: ProductCardBadgeDto[] | undefined;
}) {
  if (!badges?.length) {
    return <span className="text-[13px] text-ink-400">—</span>;
  }

  return (
    <ul className="flex w-[7.25rem] flex-col items-start gap-1" role="list">
      {badges.map((badge) => (
        <li className="max-w-full min-w-0" key={badge.kind} role="listitem">
          <AdminProductBadgeChip
            bgClass={badge.bg}
            className="inline-block max-w-full whitespace-nowrap"
            labelStyle="sentence"
            size="xs"
            text={badge.text}
            title={badge.text}
          />
        </li>
      ))}
    </ul>
  );
}
