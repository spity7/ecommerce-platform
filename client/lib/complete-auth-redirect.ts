import { applyPendingWishlistAfterAuth } from "@/lib/pending-wishlist";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";

export async function completeStorefrontAuthRedirect(
  push: (path: string) => void,
  options?: { signupVerify?: boolean }
): Promise<void> {
  await applyPendingWishlistAfterAuth();
  window.dispatchEvent(new Event("auth:session-updated"));

  const returnTo = getPostAuthRedirectPath();
  if (options?.signupVerify && returnTo === "/account-info") {
    push("/account-info?verify=1");
    return;
  }

  push(returnTo);
}
