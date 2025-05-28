// file: scripts/fixImageUrls.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fixImageUrls() {
  try {
    const places = await prisma.place.findMany();

    for (const place of places) {
      const url = place.imageUrl;

      // Check if it's a relative path without a leading slash
      if (url && !url.startsWith("/") && !url.startsWith("http")) {
        const fixedUrl = "/" + url;

        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl: fixedUrl },
        });

        console.log(`✔️ Updated imageUrl for place ID ${place.id}: ${fixedUrl}`);
      }
    }

    console.log("✅ Done fixing image URLs.");
  } catch (err) {
    console.error("❌ Error fixing image URLs:", err);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
