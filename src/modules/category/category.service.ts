import { prisma } from "lib/prisma";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

import slugify from "slugify";

export async function storeCategory({ logo, ...data }: createCategorySchema) {
  const slug = slugify(data.name, { lower: true });
  if(await findCategoryBySlug(slug)){
    throw Error('Category Already Exists')
  }
  return prisma.category.create({
    data: {
      ...data,
      slug,
    },
  });
}

export async function updateCategory(
  id: string,
  { logo, ...data }: updateCategorySchema,
) {
  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

export async function searchCategory(search: string) {
  return prisma.category.findMany({
    where: {
      name: {
        contains: search?.trim(),
        mode: "insensitive",
      },
    },
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: {
      id,
    },
  });
}

export async function findCategoryBySlug(slug:string){
    return prisma.category.findUnique({where:{slug}})
}
