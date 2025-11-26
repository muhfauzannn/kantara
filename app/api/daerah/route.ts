import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch daerah data",
      },
      { status: 500 }
    );
  }
}
