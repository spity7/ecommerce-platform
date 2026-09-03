"use client";

import Image from "next/image";
import Link from "next/link";
import type { OrderDto } from "@platform/shared";
import { formatCurrency } from "@/lib/price";

type OrderItemsListProps = {
  items: OrderDto["items"];
  linkProducts?: boolean;
};

export default function OrderItemsList({
  items,
  linkProducts = true,
}: OrderItemsListProps) {
  return (
    <ul className="list-unstyled mb--0">
      {items.map((item) => (
        <li
          key={`${item.productId}-${item.productSlug}`}
          className="d-flex gap-3 mb--16"
        >
          <Image
            src={item.productImage || "/assets/images/product-img/beauty-product/beauty-product-st-05.webp"}
            alt={item.productName}
            width={64}
            height={64}
            className="rounded"
          />
          <div className="flex-grow-1">
            {linkProducts ? (
              <Link
                href={`/product/${item.productSlug}`}
                className="mb--4 b2 rbt-text-medium d-block"
              >
                {item.productName}
              </Link>
            ) : (
              <p className="mb--4 b2 rbt-text-medium">{item.productName}</p>
            )}
            <p className="mb--0 b3">
              {item.quantity} × {formatCurrency(item.price)} —{" "}
              {formatCurrency(item.lineTotal)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
