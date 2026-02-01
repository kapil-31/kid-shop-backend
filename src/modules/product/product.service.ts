import { prisma } from "lib/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(data: CreateProductInput) {
  return await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      attributes: data.attributes
    }
  });
}