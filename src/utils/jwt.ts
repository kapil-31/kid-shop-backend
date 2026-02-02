import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "6d";
const REFRESH_TOKEN_TTL = "7d";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_TTL
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_TTL
  });
}


export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
}