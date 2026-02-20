import { CookieOptions, Request, Response } from "express";
import { authSchema } from "./auth.schema";
import { findOneUser } from "@modules/user/user.service";
import bcrypt from "bcrypt";
import {
  decodeJwtToken,
  setHttpCookies,
  signAccessToken,
  signRefreshToken,
} from "@utils/jwt";
import {
  findUniqueToken,
  revokeToken,
  storeRefreshToken,
} from "./auth.service";
import { hash } from "@utils/helpers";
import { prisma } from "lib/prisma";
import { getCartByUser, getCartItemsCount } from "@modules/cart/cart.service";

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

  const hashedRefreshtoken = await hash(refreshToken);

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
    user :  {
      ...user,
      password:undefined
    },
  });
}

export async function refreshHandler(req: Request, res: Response) {
  let token = req.headers.authorization  || req.cookies.refreshToken;
  token = token?.startsWith('Bearer') ? token?.split("Bearer ")?.[1]: token;
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }


  const storedToken = await findUniqueToken(token);

  if (!storedToken || storedToken.revoked) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  try {
    // const isValidToken = await bcrypt.compare(token, storedToken.token);

    // console.log({isValidToken,token,stored:storedToken.token})

    // if (!isValidToken) throw Error("Invalid Token");

    const user = await findOneUser({ id: storedToken.userId });

    if (!user) throw Error("Malicious activity");

    const tokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };

    const newAccessToken = signAccessToken(tokenPayload);

    const newRefreshToken = signRefreshToken(tokenPayload);

    await revokeToken(token);

    await storeRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const [accessTokenExpires, refreshTokenExpire] = [
      decodeJwtToken(newAccessToken),
      decodeJwtToken(newRefreshToken),
    ];

    const hashedRefreshtoken = await hash(newRefreshToken);

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
      setHttpCookies("accessToken", newAccessToken, res, {
        expires: new Date(accessTokenExpires.exp * 1000),
      });
    }

    return res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401);
    res.statusMessage = error?.message ?? "Something went worng";

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
    const result = await findOneUser({ id: user.userId });
    const cart = await getCartByUser(result?.id!);
    const cartItemsCount = !cart ? 0 :  await getCartItemsCount(cart?.id!)
    res.json({
      ...result,
      cartItemsCount:cartItemsCount,
    });
  }
}
