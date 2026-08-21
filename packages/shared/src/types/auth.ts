export const USER_ROLES = ["admin", "customer"] as const;
export type UserRole = (typeof USER_ROLES)[number];
