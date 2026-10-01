import { applyPendingWishlistAfterAuth } from "@/lib/pending-wishlist";
import { redirectAdminToAdminApp } from "@/lib/admin-app-link";
import { getPostAuthRedirectPath } from "@/lib/auth-redirect";
import type { UserDto } from "@platform/shared";

export async function completeStorefrontAuthRedirect(
  push: (path: string) => void,
  options?: { signupVerify?: boolean; user?: UserDto | null }
): Promise<void> {
  if (options?.user?.role === "admin") {
    window.dispatchEvent(new Event("auth:session-updated"));
    redirectAdminToAdminApp();
    return;
  }

  await applyPendingWishlistAfterAuth();
  window.dispatchEvent(new Event("auth:session-updated"));

  const returnTo = getPostAuthRedirectPath();
  if (options?.signupVerify && returnTo === "/account-info") {
    push("/account-info?verify=1");
    return;
  }

  push(returnTo);
}
