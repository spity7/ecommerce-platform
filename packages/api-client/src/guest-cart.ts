let guestCartId: string | null = null;

export function setGuestCartId(id: string | null): void {
  guestCartId = id;
}

export function getGuestCartId(): string | null {
  return guestCartId;
}
