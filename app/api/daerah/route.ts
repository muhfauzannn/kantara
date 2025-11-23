import { NextRequest, NextResponse } from "next/server";
import { getPrismaClientClass } from "../../../lib/generated/prisma/internal/class";

const PrismaClient = getPrismaClientClass(__dirname);

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();

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
  } finally {
    await prisma.$disconnect();
  }
}
