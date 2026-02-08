import { prisma } from "lib/prisma";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

import slugify from "slugify";

 type storeCateogryType = Omit<createCategorySchema, 'temLogoId'>

export async function storeCategory({  ...data }: storeCateogryType) {
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
  { ...data }: Partial<storeCateogryType>,
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
