import { prisma } from "lib/prisma";
import { createCouponSchema } from "./coupon.schema";
import { updateCategorySchema } from "@modules/category/category.schema";
export async function storeCoupon(data: createCouponSchema) {
  return prisma.coupon.create({
    data: data,
  });
}

export async function updateCoupon(id: string, data: updateCategorySchema) {
  return prisma.coupon.update({
    where: {
      id,
    },
    data,
  });
}

export async function findCouponByCode(code: string) {
  return prisma.coupon.findUnique({
    where: {
      code: code,
    },
  });
}

export async function getCouponById(id: string) {
  return prisma.coupon.findUnique({
    where: {
      id: id,
    },
  });
}

export async function searchCoupon() {
  return prisma.coupon.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({
    where: {
      id,
    },
  });
}

export async function getCouponeByCode(code: string) {
  return prisma.coupon.findUnique({
    where: {
      code,
    },
  });
}

