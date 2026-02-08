import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@utils/jwt";

export function requireAuth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {


  let token = req.headers.authorization || req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

   token = token.startsWith("Bearer ") ?  token.split(" ")[1] : token;
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
