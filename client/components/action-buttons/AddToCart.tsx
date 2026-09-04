"use client";

import { useContextElement } from "@/context/Context";
import { Product } from "@/types";
import ModalTriggerButton from "@/components/action-buttons/ModalTriggerButton";

interface AddToCartProps {
  parentClass?: string;
  product: Product;
}

export default function AddToCart({
  parentClass = "rbt-btn rbt-btn-sm has-left-icon rbt-cart-sidenav-activation",
  product,
}: AddToCartProps) {
  const { addProductToCart, isAddedToCartProducts, quantityInCart } =
    useContextElement();

  const isAdded = isAddedToCartProducts(product.id);
  const canIncrement = Boolean(product.apiProductId);

  if (isAdded && !canIncrement) {
    return (
      <button type="button" className={parentClass}>
        <i className="fa-regular fa-cart-shopping mr--4" /> Already Added
      </button>
    );
  }

  const label = isAdded
    ? `Add another (${quantityInCart(product.id)} in cart)`
    : "Add To Cart";

  return (
    <ModalTriggerButton
      openModalName="cartSidebar"
      className={parentClass}
      onClick={() => {
        addProductToCart(product);
      }}
    >
      <i className="fa-regular fa-cart-shopping mr--4" /> {label}
    </ModalTriggerButton>
  );
}
