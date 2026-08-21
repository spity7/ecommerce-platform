import type { UserDto } from "@platform/shared";

function getApiUrl(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000"
  );
}

export async function fetchAdminUser(
  accessToken: string
): Promise<UserDto | null> {
  try {
    const response = await fetch(`${getApiUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as UserDto;
    return user.role === "admin" ? user : null;
  } catch {
    return null;
  }
}
