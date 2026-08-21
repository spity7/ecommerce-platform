import { getApiBaseUrl } from "@platform/api-client";
import type { UserDto } from "@platform/shared";

export async function fetchCustomerUser(
  token: string
): Promise<UserDto | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as UserDto;
    return user.role === "customer" || user.role === "admin" ? user : null;
  } catch {
    return null;
  }
}
