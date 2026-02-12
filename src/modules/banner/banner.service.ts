import { UPLOAD_DIR } from "@modules/file-upload/config";
import { prisma } from "lib/prisma";
import { basename, join } from "path";
import fs from "fs";

export const storeBanner = async (data: { logo: string }) => {
  return prisma.banners.create({
    data,
  });
};
export const getBanners = async () => {
  return prisma.banners.findMany({
  });
};

export const getBannerById = async (id: string) => {
  return prisma.banners.findUnique({
    where: {
      id,
    },
  });
};

export const deleteBanner = async (id: string) => {
  const bannerLogo = await getBannerById(id);
  removeBannerImages(bannerLogo?.logo ?? "");
  return prisma.banners.delete({
    where: {
      id,
    },
  });
};

export const updateBanner = async (id: string, data: { logo: string }) => {
  return prisma.banners.update({
    where: {
      id,
    },
    data,
  });
};

export const removeBannerImages = (url: string) => {
  const filename = basename(url);
  const path = join(UPLOAD_DIR, filename);

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return 1;
  }
  return 0;
};
