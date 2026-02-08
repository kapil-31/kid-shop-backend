import { prisma } from "lib/prisma";
import path from "path";
import { UPLOAD_DIR } from "../config";
import fs from "fs";
import { imageProcessingService } from "../upload.service";

export class ImageProcessor {
  private isProcessing = false;

  async processUnProcessedImages(): Promise<void> {
    if (this.isProcessing) {
      console.log("Already processing image,skipping....");
      return;
    }

    this.isProcessing = true;

    try {
      const pendingImages = await prisma.productImage.findMany({
        where: {
          status: "PENDING",
        },
        take: 10,
        orderBy: { createdAt: "asc" },
      });

      if (pendingImages.length === 0) {
        console.log("No Pending Images");
        return;
      }
      console.log(`Found ${pendingImages.length} images to process `);

      for (const image of pendingImages) {
        await this.processImage(image.id);
      }
    } catch (error) {}
  }

  async processImage(id: string): Promise<void> {
    try {
      const image = await prisma.productImage.findUnique({
        where: { id: id },
      });
      if (!image) {
        console.error(`Image ${id} Not found !!`);
        return;
      }
      if (image.status !== "PENDING") {
        console.log(`Image ${id} already processed (status:${image.status})`);
        return;
      }

      await prisma.productImage.update({
        where: { id },
        data: {
          status: "PROCESSING",
        },
      });
      console.log(`Processing image ${id}...`);

      const filename = path.basename(image.url);
      const originalPath = path.join(UPLOAD_DIR, filename);

      if (!fs.existsSync(originalPath)) {
        throw new Error(`File not found: ${originalPath}`);
      }

      const processed = await imageProcessingService.processImage(originalPath);

      await prisma.productImage.update({
        where: { id: id },
        data: {
          url: processed.url,
          urlThumb: processed.urlThumb,
          status: "COMPLETED",
        },
      });
    } catch (e) {
      console.error(` Failed to process image ${id}:`, e);

      await prisma.productImage.update({
        where: { id: id },
        data: { status: "FAILED" },
      });
    }
  }
  start(): void {
    console.log("Worker Started...");
    this.processUnProcessedImages();

    setInterval(() => {
      this.processUnProcessedImages();
    }, 10000);
  }
}
