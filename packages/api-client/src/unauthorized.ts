export type UnauthorizedHandler = () => Promise<boolean>;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(
  handler: UnauthorizedHandler | null
): void {
  unauthorizedHandler = handler;
}

export function getUnauthorizedHandler(): UnauthorizedHandler | null {
  return unauthorizedHandler;
}
