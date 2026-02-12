import { UPLOAD_DIR } from "@modules/file-upload/config";
import { prisma } from "lib/prisma";
import { basename, join } from "path";
import fs from "fs";

export const storeGallery = async (data: { photo: string }) => {
  return prisma.gallery.create({
    data,
  });
};
export const getGallery = async () => {
  return prisma.gallery.findMany({
  });
};

export const getGalleryById = async (id: string) => {
  return prisma.gallery.findUnique({
    where: {
      id,
    },
  });
};
export const deleteGallery = async (id: string) => {
  const bannerLogo = await getGalleryById(id);
  removeGalleryImage(bannerLogo?.photo ?? "");
  return prisma.gallery.delete({
    where: {
      id,
    },
  });
};

export const updateGallery = async (id: string, data: { logo: string }) => {
  return prisma.gallery.update({
    where: {
      id,
    },
    data,
  });
};

export const removeGalleryImage = (url: string) => {
  const filename = basename(url);
  const path = join(UPLOAD_DIR, filename);

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return 1;
  }
  return 0;
};
