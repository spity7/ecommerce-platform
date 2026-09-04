import { redirect } from "next/navigation";
import { WISHLIST_PAGE_PATH } from "@/lib/wishlist-paths";

export default function WishlistRedirectPage() {
  redirect(WISHLIST_PAGE_PATH);
}
