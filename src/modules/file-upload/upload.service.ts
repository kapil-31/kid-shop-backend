import { prisma } from "lib/prisma";
import { createFileSchema } from "./upload.schema";

export function storeFileInDb(data: createFileSchema) {
  return prisma.files.create({
    data: data,
  });
}

export function deleteFileFromDB(id: string) {
  return prisma.files.delete({
    where: {
      id,
    },
  });
}
