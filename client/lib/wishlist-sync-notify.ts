let wishlistSyncErrorHandler: ((message: string) => void) | null = null;

export function registerWishlistSyncErrorHandler(
  handler: (message: string) => void
): void {
  wishlistSyncErrorHandler = handler;
}

export function notifyWishlistSyncError(message: string): void {
  wishlistSyncErrorHandler?.(message);
}
