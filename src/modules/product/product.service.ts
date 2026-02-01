import { prisma } from "lib/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(data: CreateProductInput) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      attributes: data.attributes,
    },
  });
}

export async function searchProducts({
  query,
  limit = 10,
  cursor,
}: {
  query: string;
  limit: number;
  cursor?: string;
}) {
  let where = {}; 

  // build where query based on this
  const products = await prisma.product.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    where,
    orderBy: {
      id: "asc",
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

export async function updateProduct(id: string, data: Partial<CreateProductInput>) {
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
