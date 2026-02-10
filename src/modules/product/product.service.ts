import { prisma } from "lib/prisma";
import { CreateProductInput } from "./product.schema";
import { ProductClientType } from "types/product.types";

type StoreProductInput = Omit<CreateProductInput, "images">;
export type ProductImage = { name: string; url: string; size: number }
export async function createProduct(data: StoreProductInput,images:ProductImage[] = []) {
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
      images:{
       
        select:{
          id:true,
          name:true,
          url:true
        }

      }
    },
  });
}

export async function searchProducts({
  query,
  limit = 10,
  cursor,
}: {
  query?: string;
  limit?: number;
  cursor?: string;
}):Promise<{
  data:ProductClientType[],
  nextCursor:string | null;
}> {
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
    include:{
      images:{
        select:{id:true,url:true,name:true}
      },
      category:{
        select:{id:true,name:true}
      }
    }
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
