import { getCartById } from "@modules/cart/cart.service";
import { throwError } from "@utils/helpers";
import { prisma } from "lib/prisma";
import { ShippingAddress } from "./orderSchema";
import { getCouponeByCode } from "@modules/coupon/coupon.service";

export async function createOrder({
  cartId,
  userId,
  note,
  shippingAddress,
  coupon,
}: {
  userId: string;
  cartId: string;
  shippingAddress?: ShippingAddress;
  note?: string;
  coupon?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    // fetch cart with items ;
    const cart = await getCartById(cartId);
    if (!cart) return throwError("Cart not found", 404);

    if (cart.items.length == 0) {
      return throwError("Cart is empty", 404);
    }

    const subTotal = cart.items.reduce((a, b) => a + b.lineTotal, 0);

    const discountTotal = cart.discount ?? 0;
    const taxTotal = 0;
    const shippingTotal = 0;

    const grandTotal = subTotal - discountTotal + taxTotal + shippingTotal;
    const order = await tx.order.create({
      data: {
        userId,
        subTotal,
        discountTotal,
        taxTotal,
        shippingTotal,
        grandTotal,
        currency: "NPR",
        placedAt: now,
        note,
      },
    });
     await tx.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        discountAmount: 0,
        line_total: item.quantity * item.product.price,
      })),
    });
    if (coupon) {
      // need to refactor coupon logic
      const coup = await getCouponeByCode(coupon);
      if (coup) {
        await tx.couponRedemption.create({
          data: {
            couponId: coup?.id,
            orderId: order.id,
            userId,
            discountApplied: discountTotal,
            redeemedAt: now,
          },
        });
      }
    }


    for (const item of cart.items) {
     const result =  await tx.product.updateMany({
        where: {
          id: item.productId,
          stockQty: {
            gte: item.quantity,
          },
        },
        data: {
          stockQty: {
            decrement: item.quantity,
          },
          totalSold: {
            increment: item.quantity,
          },
        },
      });
      if(result.count ==0){
        return throwError('Stock update failed - possibly out of stock')
      }
    }
   
    if (shippingAddress) {
      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          type: "SHIPPING",
          fullName:
            shippingAddress?.firstName + " " + shippingAddress?.lastName,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone,
          country: "nepal",
        },
      });
    }
    await tx.cart.delete({
      where: { id: cartId },
    });
  });
}
