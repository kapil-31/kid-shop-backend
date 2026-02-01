import { prisma } from "lib/prisma";
import { authSchema } from "./auth.schema";
import { findOneUser } from "@modules/user/user.service";

export async function checkUser(data: authSchema) {
  return findOneUser(data);
}

export async function storeRefreshToken(data: {
  token: string;
  userId: string;
  expiresAt: Date;
}) {
  await prisma.refreshToken.create({
    data: data,
  });
}

export async function findUniqueToken(token: string) {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
}

export async function revokeToken(token: string) {
  return prisma.refreshToken.updateMany({
    where: {
      token: token,
    },
    data: {
      revoked: true,
    },
  });
}
