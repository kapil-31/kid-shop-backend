import { prisma } from "lib/prisma";
import { CreateProductInput } from "./product.schema";
import { ProductClientType } from "types/product.types";
import { Prisma } from "prisma/generated/prisma/client";
import { subDays } from "date-fns";

type StoreProductInput = Omit<CreateProductInput, "images">;
export type ProductSearchQuery = {
  limit: string;
  cursor: string;
  search?: string;
  status?: "new_arrival" | "is_featured" | "best_seller";
};
export type ProductImage = { name: string; url: string; size: number };
export async function createProduct(
  data: StoreProductInput,
  images: ProductImage[] = [],
) {
  return prisma.product.create({
    data: {
      ...data,
      images: {
        create: images,
      },
    },
  });
}

export async function getProudctById(id: string) {
  return prisma.product.findUnique({
    where: {
      id,
      category: {
        isActive: true,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          logo: true,
          description: true,
          isActive: true,
        },
      },
      images: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });
}

export async function searchProducts({
  cursor,
  search,
  status,
  ...rest
}: ProductSearchQuery): Promise<{
  data: ProductClientType[];
  nextCursor: string | null;
}> {
  let limit = Number(rest.limit ?? "10");
  let where: Prisma.ProductWhereInput = {
    
  };
  let orderBy: Prisma.ProductOrderByWithRelationInput = {
      id: "asc",
  };

  switch (status) {
    case "best_seller":
      delete orderBy.id;
      orderBy.totalSold = "desc";
      break;
    case "is_featured":
      where.isFeatured = true;
      break;
    case "new_arrival":
      where = {
        ...where,
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      };
      break;
  }

  if (search) {
    where = {
      ...where,
      name: {
        contains: search,
        mode: "insensitive",
      },
    };
  }

  // build where query based on this
  const products = await prisma.product.findMany({
    take: Number(limit) + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    where,
    orderBy: {
      ...orderBy,
    },
    include: {
      images: {
        select: { id: true, url: true, name: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  });

  let nextCursor: string | null = null;

  if (products.length > limit) {
    const nextItem = products.pop();
    nextCursor = nextItem!.id;
  }

  return {
    data: products,
    nextCursor,
  };
}

export async function updateProduct(
  id: string,
  data: Partial<StoreProductInput>,
) {
  return prisma.product.update({
    where: {
      id,
    },
    data,
  });
}

export async function removeProduct(id: string) {
  return prisma.product.delete({
    where: {
      id,
    },
  });
}
