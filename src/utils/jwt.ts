import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "1d";
const REFRESH_TOKEN_TTL = "7d";

type TokenPaylod  = {
  user:string,
  role:"CUSTOMER" | "ADMIN"
  email:string;
  iat:number,
  exp:number
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}

export function decodeJwtToken(token:string):TokenPaylod | null {
  return jwt.decode(token) as TokenPaylod;
}
export function setHttpCookies(
  name: string,
  value: any,
  res: Response,
  opts?: CookieOptions,
) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...opts,
  });
}
