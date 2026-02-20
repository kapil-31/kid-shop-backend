import { Prisma } from "prisma/generated/prisma/client";

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: { product: true }
    }
  }
}>;