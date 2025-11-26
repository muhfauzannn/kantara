import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fallbackDaerahData } from "@/lib/data/fallback-daerah";

export async function GET() {
  if (!prisma) {
    console.warn("Prisma tidak tersedia, menggunakan data fallback untuk daerah.");
    return NextResponse.json({
      success: true,
      data: fallbackDaerahData,
      fallback: true,
    });
  }

  try {
    const daerah = await prisma.daerah.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        nama: true,
        description: true,
        latitude: true,
        longitude: true,
        icon: true,
        backgroundImg: true,
        images: true,
        kebudayaans: {
          select: {
            id: true,
            nama: true,
            jenis: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: daerah,
    });
  } catch (error) {
    console.error("Error fetching daerah data:", error);
    console.warn("Serving fallback daerah dataset");
    return NextResponse.json({
      success: true,
      data: fallbackDaerahData,
      fallback: true,
    });
  }
}
