import { CookieOptions, Request, Response } from "express";
import { authSchema } from "./auth.schema";
import { findOneUser } from "@modules/user/user.service";
import bcrypt from "bcrypt";
import {
  decodeJwtToken,
  setHttpCookies,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@utils/jwt";
import {
  findUniqueToken,
  revokeToken,
  storeRefreshToken,
} from "./auth.service";
import { hash } from "@utils/helpers";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  domain: "localhost",
};
export async function loginHandler(req: Request, res: Response) {
  const input = authSchema.parse(req.body);
  const user = await findOneUser({ email: input.email });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    res.status(401);
    throw Error("Invalid credentials");
  }
  const signingPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = signAccessToken(signingPayload);

  const refreshToken = signRefreshToken(signingPayload);

  const [accessTokenExpires, refreshTokenExpire] = [
    decodeJwtToken(accessToken),
    decodeJwtToken(refreshToken),
  ];

  const hashedRefreshtoken = await hash(refreshToken)

  if (refreshTokenExpire) {
    let expiresAt = new Date(refreshTokenExpire.exp * 1000);
    await storeRefreshToken({
      token: hashedRefreshtoken,
      userId: user.id,
      expiresAt,
    });
    setHttpCookies("refreshToken", hashedRefreshtoken, res, {
      expires: expiresAt,
    });
  }

  if (accessTokenExpires) {
    setHttpCookies("accessToken", accessToken, res, {
      expires: new Date(accessTokenExpires.exp * 1000),
    });
  }

  return res.json({
    success: true,
    user,
  });
}

export async function refreshHandler(req: Request, res: Response) {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }
  token = token?.split("Bearer ")[1];

  const storedToken = await findUniqueToken(token);

  if (!storedToken || storedToken.revoked) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const { userId, role } = verifyRefreshToken(token) as {
    userId: string;
    role: string;
  };

  // await revokeToken(token);
  try {
    const newAccessToken = signAccessToken({ userId, role });

    const newRefreshToken = signRefreshToken({ userId, role });

    await storeRefreshToken({
      token: newRefreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh",
    });

    return res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw error;
  }
}

export async function logoutHandler(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (token) {
    await revokeToken(token);
  }

  res.json({ success: true });
}

export async function getMeHandler(req: Request, res: Response) {
  const user = req?.user;
  if (user) {
    const result = await findOneUser({ id: user.id });
    res.json(result);
  }
}
