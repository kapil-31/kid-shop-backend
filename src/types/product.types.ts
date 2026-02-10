import { Prisma } from "prisma/generated/prisma/client";

export type ProductClientType =
  Prisma.ProductGetPayload<{
    include: {
      images: {
        select: {
          id: true;
          name: true;
          url: true;
        };
      };
      category: {
        select: {
          id: true;
          name: true;
        };
      };
    };
  }>;



