import { getApiBaseUrl } from "@platform/api-client";
import type { UserDto } from "@platform/shared";

export type CustomerSessionResult =
  | { status: "ok"; user: UserDto }
  | { status: "invalid" }
  | { status: "rate_limited" };

export async function fetchCustomerUser(
  token: string
): Promise<CustomerSessionResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (response.status === 429) {
      return { status: "rate_limited" };
    }

    if (!response.ok) {
      return { status: "invalid" };
    }

    const user = (await response.json()) as UserDto;
    if (user.role === "customer" || user.role === "admin") {
      return { status: "ok", user };
    }

    return { status: "invalid" };
  } catch {
    return { status: "invalid" };
  }
}
