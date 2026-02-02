import { prisma } from "lib/prisma";
import { createCouponSchema } from "./coupon.schema";
import { updateCategorySchema } from "@modules/category/category.schema";

export async function storeCoupon(data:createCouponSchema){

    return prisma.coupon.create({
        data:data
    })
}

export async function updateCoupon(id:string,data:updateCategorySchema){
    return prisma.coupon.update({
        where:{
            id
        },
        data
    })
}

export async function  searchCoupon(search:string){
    return prisma.coupon.findMany({
        where:{
            code:{
                contains:search?.trim(),
                mode:"insensitive"
            }
            
        }
    })
}

export async function deleteCoupon(id:string){
    return prisma.category.delete({
        where:{
            id
            
        }
    })
}