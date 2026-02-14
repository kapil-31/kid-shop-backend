
import { ProductClientType } from "types/product.types";

export type ProductImageDto = {
  id: string;
  name: string;
  url: string;
};

export type ProductResponseDto = {
  id: string;
  name: string;
  price: number; // NEVER expose Prisma Decimal
  stock: number;
  isActive:boolean;
  createdAt: Date;
  isFeatured:boolean;
  images: ProductImageDto[];
  description: string;
  category: {
    id: string;
    name: string;
  };
};

export function toProductDto(
  product: ProductClientType
): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: product.stockQty,
    isActive: product.isActive,
    createdAt: product.createdAt,
    images: product.images,
    description: product.description,
    isFeatured:product.isFeatured,
    category: product.category,
  };
}
