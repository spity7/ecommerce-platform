let cartSyncErrorHandler: ((message: string) => void) | null = null;

export function registerCartSyncErrorHandler(
  handler: (message: string) => void
): void {
  cartSyncErrorHandler = handler;
}

export function notifyCartSyncError(message: string): void {
  cartSyncErrorHandler?.(message);
}
