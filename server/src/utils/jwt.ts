import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type TokenPayload = {
  userId: string;
  role: string;
  email: string;
  tokenVersion?: number;
};

const accessSignOptions: SignOptions = {
  expiresIn: env.jwt.accessExpiresIn as SignOptions["expiresIn"],
};

const refreshSignOptions: SignOptions = {
  expiresIn: env.jwt.refreshExpiresIn as SignOptions["expiresIn"],
};

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, accessSignOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret, refreshSignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as TokenPayload;
}
