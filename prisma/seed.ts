import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed process...");

  // Read the data.json file from prisma directory
  const dataPath = path.join(__dirname, "data.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const daerahData = JSON.parse(rawData);

  console.log(`📊 Found ${daerahData.length} daerah to seed`);

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.kebudayaan.deleteMany();
  await prisma.daerah.deleteMany();

  // Insert each daerah with its kebudayaans
  for (const daerah of daerahData) {
    console.log(`\n📍 Processing: ${daerah.nama}`);

    try {
      const createdDaerah = await prisma.daerah.create({
        data: {
          nama: daerah.nama,
          description: daerah.description,
          latitude: daerah.latitude,
          longitude: daerah.longitude,
          icon: daerah.icon,
          backgroundImg: daerah.backgroundImg,
          images: daerah.images || [],
          kebudayaans: {
            create:
              daerah.kebudayaans?.map((kebudayaan: any) => ({
                nama: kebudayaan.nama,
                description: kebudayaan.description,
                jenis: kebudayaan.jenis,
                virtualTour: kebudayaan.virtualTour || null,
                images: kebudayaan.images || [],
              })) || [],
          },
        },
        include: {
          kebudayaans: true,
        },
      });

      console.log(
        `  ✅ Created ${daerah.nama} with ${createdDaerah.kebudayaans.length} kebudayaans`
      );
    } catch (error) {
      console.error(`  ❌ Error creating ${daerah.nama}:`, error);
    }
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
