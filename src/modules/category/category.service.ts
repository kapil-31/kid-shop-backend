import { prisma } from "lib/prisma";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

    import slugify from "slugify";

export async function storeCategory(data:createCategorySchema){

const slug = slugify(data.name, { lower: true });
    return prisma.category.create({
        data:{
            ...data,
            slug
        }
    })
}

export async function updateCategory(id:string,data:updateCategorySchema){
    return prisma.category.update({
        where:{
            id
        },
        data
    })
}

export async function searchCategory(search:string){
    return prisma.category.findMany({
        where:{
            name:{
                contains:search?.trim(),
                mode:"insensitive"
            }
            
        }
    })
}

export async function deleteCategory(id:string){
    return prisma.category.delete({
        where:{
            id
            
        }
    })
}