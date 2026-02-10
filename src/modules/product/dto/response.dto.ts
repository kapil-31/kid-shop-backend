
import { ProductWithRelations } from "types/product.types";

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
  createdAt: Date;
  images: ProductImageDto[];
  description: string;
  category: {
    id: string;
    name: string;
  };
};

export function toProductDto(
  product: ProductWithRelations
): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    stock: product.stockQty,
    createdAt: product.createdAt,
    images: product.images,
    description: product.description,
    category: product.category,
  };
}
