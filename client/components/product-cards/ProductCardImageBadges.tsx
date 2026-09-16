import type { ProductBadge } from "@/types/product";

type ProductCardImageBadgesProps = {
  badges?: ProductBadge[] | null;
  badge?: ProductBadge | null;
  layout?: "stack" | "singleAbsolute";
  rounded?: boolean;
};

function normalizeBadgeClass(bg?: string): string {
  if (!bg) {
    return "rbt-product-badge-bg-primary";
  }
  if (bg.startsWith("rbt-product-badge-")) {
    return bg;
  }
  if (bg.startsWith("bg-")) {
    return `rbt-product-badge-${bg.slice(3)}`;
  }
  return bg.startsWith("rbt-") ? bg : `rbt-product-badge-bg-${bg}`;
}

function resolveBadgeList(
  badges?: ProductBadge[] | null,
  badge?: ProductBadge | null
): ProductBadge[] {
  if (badges && badges.length > 0) {
    return badges;
  }
  if (badge) {
    return [badge];
  }
  return [];
}

export default function ProductCardImageBadges({
  badges,
  badge,
  layout = "stack",
  rounded = false,
}: ProductCardImageBadgesProps) {
  const list = resolveBadgeList(badges, badge);
  if (list.length === 0) {
    return null;
  }

  const roundedClass = rounded ? " border-rounded" : "";

  if (layout === "singleAbsolute") {
    return (
      <>
        {list.map((item, index) => (
          <div
            key={`${item.text}-${index}`}
            className={`${normalizeBadgeClass(item.bg)} rbt-product-badge rbt-badge-top-left--position${roundedClass}`}
          >
            {item.text}
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="rbt-badge-wrapper rbt-content-top-left">
      {list.map((item, index) => (
        <div
          key={`${item.text}-${index}`}
          className={`rbt-product-badge ${normalizeBadgeClass(item.bg)}${roundedClass}`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
