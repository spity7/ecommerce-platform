"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import type {
  Product as ProductType,
  CartProduct as CartProductType,
} from "@/types";
import { getAccessToken } from "@platform/api-client";
import {
  isServerCartEnabled,
  syncAddToServerCart,
  syncClearServerCart,
  syncRemoveServerCartItem,
  syncUpdateServerCartItem,
} from "@/lib/cart-sync";
import {
  isServerWishlistEnabled,
  queueWishlistMutation,
  getPendingWishlistMutationCount,
  syncAddToServerWishlist,
  syncRemoveFromServerWishlist,
} from "@/lib/wishlist-sync";
import { redirectToSignIn } from "@/lib/auth-redirect";
import { stashPendingWishlistProduct } from "@/lib/pending-wishlist";

export type Product = ProductType;
export type CartProduct = CartProductType;
export type ProductId = number | string;

interface StoreState {
  cartProducts: CartProduct[];
  wishList: Product[];
  compareItem: Product[];
  quickViewItem: Product;
  quickAddItem: ProductId;
  totalPrice: number;
  activeCartProduct: CartProduct | null;
  setCartProducts: (
    value: CartProduct[] | ((prev: CartProduct[]) => CartProduct[])
  ) => void;
  setWishList: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setQuickViewItem: (item: Product) => void;
  setQuickAddItem: (id: ProductId) => void;
  setCompareItem: (value: Product[] | ((prev: Product[]) => Product[])) => void;
  setActiveCartProduct: (item: CartProduct | null) => void;
  isAddedToCartProducts: (id: ProductId) => boolean;
  addProductToCart: (item: Product, qty?: number) => void;
  removeFromCart: (id: ProductId) => void;
  updateQuantity: (id: ProductId, qty: number) => void;
  quantityInCart: (id: ProductId) => number;
  addToWishlist: (item: Product) => "ok" | "auth_required";
  removeFromWishlist: (id: ProductId) => void;
  addToCompareItem: (item: Product) => void;
  removeFromCompareItem: (id: ProductId) => void;
  isAddedtoWishlist: (id: ProductId) => boolean;
  isAddedToCompareItem: (id: ProductId) => boolean;
}

const getTotalPrice = (cart: CartProduct[]) =>
  cart.reduce((acc, product) => acc + product.quantity * product.price, 0);

/** Initial quick-view slot before any product is chosen (avoids importing demo catalog into the store module). */
const EMPTY_QUICK_VIEW_PRODUCT: Product = {
  id: 0,
  title: "",
  price: 0,
  imgSrc: "",
};

type StoreSetState = (
  partial: Partial<StoreState> | ((state: StoreState) => Partial<StoreState>)
) => void;

function applyServerWishlistWhenIdle(
  set: StoreSetState,
  serverWishlist: Product[]
): void {
  if (getPendingWishlistMutationCount() === 0) {
    set({ wishList: serverWishlist });
  }
}

function rollbackWishlistAdd(set: StoreSetState, item: Product): void {
  set((state) => ({
    wishList: state.wishList.filter((elm) => elm.id != item.id),
  }));
}

function rollbackWishlistRemove(set: StoreSetState, item: Product): void {
  set((state) => ({
    wishList: state.wishList.some((elm) => elm.id == item.id)
      ? state.wishList
      : [...state.wishList, item],
  }));
}

function queueServerWishlistMutation(
  set: StoreSetState,
  item: Product,
  removing: boolean
): void {
  const apiProductId = item.apiProductId;
  if (!apiProductId) {
    return;
  }

  void queueWishlistMutation(() =>
    removing
      ? syncRemoveFromServerWishlist(apiProductId)
      : syncAddToServerWishlist(apiProductId)
  ).then((serverWishlist) => {
    if (serverWishlist) {
      applyServerWishlistWhenIdle(set, serverWishlist);
      return;
    }

    if (removing) {
      rollbackWishlistRemove(set, item);
      return;
    }

    rollbackWishlistAdd(set, item);
  });
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      wishList: [],
      compareItem: [],
      quickViewItem: EMPTY_QUICK_VIEW_PRODUCT,
      quickAddItem: 0,
      totalPrice: 0,
      activeCartProduct: null,

      setCartProducts: (value) =>
        set((state) => {
          const next =
            typeof value === "function" ? value(state.cartProducts) : value;
          return { cartProducts: next, totalPrice: getTotalPrice(next) };
        }),

      setWishList: (value) =>
        set((state) => ({
          wishList: typeof value === "function" ? value(state.wishList) : value,
        })),

      setQuickViewItem: (item) => set({ quickViewItem: item }),
      setQuickAddItem: (id) => set({ quickAddItem: id }),
      setCompareItem: (value) =>
        set((state) => ({
          compareItem:
            typeof value === "function" ? value(state.compareItem) : value,
        })),
      setActiveCartProduct: (item) => set({ activeCartProduct: item }),

      isAddedToCartProducts: (id) => {
        const cart = get().cartProducts;
        return cart.some((elm) => elm.id == id);
      },

      addProductToCart: (item, qty = 1) => {
        const { cartProducts, isAddedToCartProducts } = get();

        if (item.apiProductId && isServerCartEnabled()) {
          void syncAddToServerCart(item.apiProductId, qty).then(
            (serverCart) => {
              if (serverCart) {
                set({
                  cartProducts: serverCart,
                  totalPrice: getTotalPrice(serverCart),
                });
              }
            }
          );
          return;
        }

        if (isAddedToCartProducts(item.id)) return;
        const cartItem: CartProduct = {
          ...item,
          quantity: qty,
        };
        const next = [...cartProducts, cartItem];
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      removeFromCart: (id) => {
        const { cartProducts } = get();
        const item = cartProducts.find((entry) => entry.id === id);

        if (item?.serverCartItemId && isServerCartEnabled()) {
          void syncRemoveServerCartItem(item.serverCartItemId).then(
            (serverCart) => {
              if (serverCart) {
                set({
                  cartProducts: serverCart,
                  totalPrice: getTotalPrice(serverCart),
                });
              }
            }
          );
          return;
        }

        const next = cartProducts.filter((entry) => entry.id !== id);
        set({ cartProducts: next, totalPrice: getTotalPrice(next) });
      },

      updateQuantity: (id, qty) => {
        const { cartProducts, isAddedToCartProducts } = get();
        if (!isAddedToCartProducts(id) || qty < 1) return;

        const item = cartProducts.find((entry) => entry.id === id);
        if (item?.serverCartItemId && isServerCartEnabled()) {
          void syncUpdateServerCartItem(item.serverCartItemId, qty).then(
            (serverCart) => {
              if (serverCart) {
                set({
                  cartProducts: serverCart,
                  totalPrice: getTotalPrice(serverCart),
                });
              }
            }
          );
          return;
        }

        const items = cartProducts.map((entry) =>
          entry.id === id ? { ...entry, quantity: qty } : entry
        );
        set({ cartProducts: items, totalPrice: getTotalPrice(items) });
      },

      quantityInCart: (id) => {
        const item = get().cartProducts.find((elm) => elm.id === id);
        return item ? item.quantity : 0;
      },

      addToWishlist: (item) => {
        const { wishList } = get();
        const isAlreadyAdded = wishList.some((elm) => elm.id == item.id);

        if (item.apiProductId && isServerWishlistEnabled()) {
          if (!getAccessToken()) {
            stashPendingWishlistProduct(item);
            redirectToSignIn();
            return "auth_required";
          }

          if (isAlreadyAdded) {
            set({
              wishList: wishList.filter((elm) => elm.id != item.id),
            });
            queueServerWishlistMutation(set, item, true);
          } else {
            set({ wishList: [...wishList, item] });
            queueServerWishlistMutation(set, item, false);
          }
          return "ok";
        }

        if (isAlreadyAdded) {
          set({ wishList: wishList.filter((elm) => elm.id != item.id) });
          return "ok";
        }
        set({ wishList: [...wishList, item] });
        return "ok";
      },

      removeFromWishlist: (id) => {
        const { wishList } = get();
        const item = wishList.find((elm) => elm.id == id);

        if (item?.apiProductId && isServerWishlistEnabled()) {
          if (!getAccessToken()) {
            redirectToSignIn();
            return;
          }

          set((state) => ({
            wishList: state.wishList.filter((elm) => elm.id != id),
          }));
          queueServerWishlistMutation(set, item, true);
          return;
        }

        set((state) => ({
          wishList: state.wishList.filter((elm) => elm.id != id),
        }));
      },

      addToCompareItem: (item) => {
        const { compareItem } = get();
        if (compareItem.some((elm) => elm.id == item.id)) return;
        set({ compareItem: [...compareItem, item] });
      },

      removeFromCompareItem: (id) => {
        set((state) => ({
          compareItem: state.compareItem.filter((elm) => elm.id != id),
        }));
      },

      isAddedtoWishlist: (id) => get().wishList.some((elm) => elm.id == id),
      isAddedToCompareItem: (id) =>
        get().compareItem.some((elm) => elm.id == id),
    }),
    {
      name: "beauty-station-store",
      partialize: (state) => ({
        cartProducts: state.cartProducts,
        wishList: state.wishList,
        compareItem: state.compareItem,
        // Kept for persist typing / older saved blobs; always reconciled in `getItem`.
        totalPrice: state.totalPrice,
      }),
      storage: {
        getItem: (
          name
        ): StorageValue<{
          cartProducts: CartProduct[];
          wishList: Product[];
          compareItem: Product[];
          totalPrice: number;
        }> | null => {
          if (typeof window === "undefined") return null;
          const str = window.localStorage.getItem(name);
          if (str) {
            try {
              type PersistedSlice = {
                cartProducts: CartProduct[];
                wishList: Product[];
                compareItem: Product[];
                totalPrice: number;
              };
              const parsed = JSON.parse(str) as StorageValue<
                Partial<PersistedSlice> & { state?: Partial<PersistedSlice> }
              >;
              if (!parsed?.state || typeof parsed.state !== "object") {
                return null;
              }
              const cart = Array.isArray(parsed.state.cartProducts)
                ? (parsed.state.cartProducts as CartProduct[])
                : [];
              parsed.state.cartProducts = cart;
              parsed.state.wishList = normalizeStoredProductList(
                parsed.state.wishList
              );
              parsed.state.compareItem = normalizeStoredProductList(
                parsed.state.compareItem
              );
              parsed.state.totalPrice = getTotalPrice(cart);
              return parsed as StorageValue<PersistedSlice>;
            } catch {
              return null;
            }
          }

          return null;
        },
        setItem: (
          name,
          value: StorageValue<{
            cartProducts: CartProduct[];
            wishList: Product[];
            compareItem: Product[];
            totalPrice: number;
          }>
        ) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

function normalizeStoredProductList(value: unknown): Product[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) =>
      typeof item === "object" && item !== null && "id" in item
        ? (item as Product)
        : undefined
    )
    .filter((item): item is Product => Boolean(item));
}

function getContextSnapshot(state: StoreState) {
  return state;
}

/**
 * Same API as the old useContextElement() for drop-in replacement in existing components.
 * `useShallow` compares selected fields so we re-render when cart/wishlist/etc. change,
 * without treating every store tick as a new object identity (plain selector would).
 */
export function useContextElement() {
  const store = useStore(useShallow(getContextSnapshot));
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return {
    ...store,
    mounted,
    // Provide wrapped hydration-safe checks
    isAddedToCartProducts: (id: ProductId) =>
      mounted ? store.isAddedToCartProducts(id) : false,
    isAddedtoWishlist: (id: ProductId) =>
      mounted ? store.isAddedtoWishlist(id) : false,
    isAddedToCompareItem: (id: ProductId) =>
      mounted ? store.isAddedToCompareItem(id) : false,
    quantityInCart: (id: ProductId) => (mounted ? store.quantityInCart(id) : 0),
  };
}
