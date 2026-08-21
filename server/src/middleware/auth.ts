import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler.js";
import { verifyAccessToken, type TokenPayload } from "../utils/jwt.js";

export type AuthenticatedRequest = Request & {
  auth?: TokenPayload;
};

export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = header.slice(7);
  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  if (!req.auth) {
    next(new AppError(401, "Authentication required"));
    return;
  }
  if (req.auth.role !== "admin") {
    next(new AppError(403, "Admin access required"));
    return;
  }
  next();
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = header.slice(7);
  try {
    req.auth = verifyAccessToken(token);
  } catch {
    // Invalid token — treat as guest for cart routes.
  }
  next();
}
