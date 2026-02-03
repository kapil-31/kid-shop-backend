import { Request, Response } from "express";
import { authSchema } from "./auth.schema";
import { findOneUser } from "@modules/user/user.service";
import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@utils/jwt";
import {
  findUniqueToken,
  revokeToken,
  storeRefreshToken,
} from "./auth.service";

export async function loginHandler(req: Request, res: Response) {
  console.log({req})

  const input = authSchema.parse(req.body);
  const user = await findOneUser({ email: input.email });

  if (!user) throw Error("Invalid email or password");

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const signingPayload = { userId: user.id, role: user.role };

  const accessToken = signAccessToken(signingPayload);

  const refreshToken = signRefreshToken(signingPayload);

  //  store
  await storeRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  return res.json({
    success: true,
    accessToken,
  });
}

export async function refreshHandler(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }
  const storedToken = await findUniqueToken(token);

  if (!storedToken || storedToken.revoked) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const payload = verifyRefreshToken(token) as { userId: string; role: string };

  await revokeToken(token);

  const newAccessToken = signAccessToken(payload);

  const newRefreshToken = signRefreshToken(payload);

  await storeRefreshToken({
    token: newRefreshToken,
    userId: payload.userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
  });

  return res.json({
    success: true,
    accessToken:newAccessToken,
  });
}

export async function logoutHandler(req: Request, res: Response) {
  const token = req.cookies.refreshToken;

  if (token) {
    await revokeToken(token)
  }

  res.clearCookie("refreshToken", {
    path: "/api/auth/refresh"
  });

  res.json({ success: true });
}