import { getCouponeByCode, updateCoupon } from "@modules/coupon/coupon.service";
import { getProudctById } from "@modules/product/product.service";
import { throwError } from "@utils/helpers";
import { prisma } from "lib/prisma";
import { AnyAaaaRecord } from "node:dns";
import {
  CartUpdateArgs,
  CartUpdateInput,
} from "prisma/generated/prisma/models";
import { CartWithItems } from "types/cart.type";

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const product = await getProudctById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    return prisma.cartItems.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
        lineTotal: (existingItem.quantity + quantity) * product.price,
      },
    });
  }

  return prisma.cartItems.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
      lineTotal: (product.price as any) * quantity,
    },
  });
};

export const getCartByUser = async (userId: string) => {
  return prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              images: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
  });
};

export const getCartItemsCount = (cartId: string) => {
  return prisma.cartItems.count({ where: { cartId } });
};

export const updateCart = (id: string, data: CartUpdateInput) =>
  prisma.cart.update({ where: { id }, data: data });

export const updateCartItem = async (itemId: string, quantity: number) => {
  const item = await prisma.cartItems.findUnique({
    where: { id: itemId },
    include: { product: true },
  });
 // check if qty exceed to stock 
 const productId = item?.product.id

 const product  = await getProudctById(productId!)

 if(product?.stockQty! < quantity) return throwError('Quantity Exceed stock')


  if (!item) throw new Error("Item not found");

  return prisma.cartItems.update({
    where: { id: itemId },
    data: {
      quantity,
      lineTotal: quantity * item.product.price,
    },
    include: {
      product: {
        select: {
          id: true,
          images: true,
          name: true,
        },
      },
    },
  });
};

export const deleteCartItem = async (id: string) => {
  await prisma.cartItems.delete({
    where: { id },
  });
};

export const deleteCart = async (id: string) => {
  return prisma.cart.delete({ where: { id } });
};

export const getCartById = async (id: string) =>
  prisma.cart.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

export async function calculateCartTotal(
  couponCode: string,
  cartId: string,
  userId: string,
) {
  const cart = await getCartById(cartId);
  if (!cart) return throwError("Cart not found", 404);
  const subtotal = calculateSubtotal(cart!);
  const data = await validateAndCalculate(couponCode, subtotal, userId);
  if (cart?.id) {
    await updateCart(cart?.id, {
      discount: data.discount,
    });
  }
  return data;
}

async function validateAndCalculate(
  code: string,
  subtotal: number,
  userId: string,
) {
  let discount = 0;
  let coupon = null;
  if (code) {
    coupon = await getCouponeByCode(code);
    if (!coupon) return throwError("Invalid Coupon", 404);
    if (!coupon?.isActive) return throwError("Coupon inactive");
    const now = new Date();
    if (coupon?.startAt && coupon?.startAt > now)
      return throwError("Coupon is not started yet");
    if (coupon?.endAt && coupon.endAt < now)
      return throwError("Coupon expired");

    if (coupon?.usageLimitTotal) {
      const totalUsed = await prisma.couponRedemption.count({
        where: { couponId: coupon.id },
      });
      if (totalUsed >= coupon.usageLimitTotal)
        return throwError("Coupon usage limit reached");
    }

    if (coupon?.usageLimitPerUser && userId) {
      const userUsed = await prisma.couponRedemption.count({
        where: {
          couponId: coupon.id,
          userId: userId,
        },
      });

      if (userUsed >= coupon.usageLimitPerUser)
        return throwError("You already used this coupon maximum times");
    }

    if (coupon?.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return throwError("Minimum order amount not reached");
    }

    switch (coupon!.type) {
      case "FIXED":
        discount = Math.min(coupon.value, subtotal);
        break;
      case "PERCENT":
        const percentDiscount = (subtotal * coupon.value) / 100;
        discount = Math.min(
          Math.round(percentDiscount),
          coupon?.maxDiscount ? coupon.maxDiscount : percentDiscount,
          subtotal,
        );
        break;
      case "FREE_SHIPPING":
        discount = 0;
        break;
    }
  }

  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    couponApplied: coupon ? coupon.code : null,
  };
}

function calculateSubtotal(cart: CartWithItems) {
  return cart.items.reduce(
    (acc, item) => acc + item.quantity * Number(item.product.price),
    0,
  );
}
