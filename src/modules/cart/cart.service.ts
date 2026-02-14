import { getProudctById } from "@modules/product/product.service";
import { prisma } from "lib/prisma";
import { AnyAaaaRecord } from "node:dns";

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
        lineTotal:
          (existingItem.quantity + quantity) * product.price,
      },
    });
  }

  return prisma.cartItems.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
      lineTotal: (product.price as any) * quantity ,
      
    },
  });
};



export const getCartByUser = async (userId: string) => {
  return prisma.cart.findUnique({
    where:{
      userId,
    },
    include:{
      items:{
        include:{
          product:{
            select:{
              id:true,
              images:true,
              name:true,
              description:true,
            }
          }
        }
      }
    }
  })
};

export const getCartItemsCount = (cartId:string) =>{
  return prisma.cartItems.count({where:{cartId}})

}

export const updateCartItem = async (itemId: string, quantity: number) => {
  const item = await prisma.cartItems.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

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
