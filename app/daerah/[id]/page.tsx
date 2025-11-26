import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DaerahModules from "@/modules/DaerahModules";
import { prisma } from "@/lib/prisma";
import { getFallbackDaerahById } from "@/lib/data/fallback-daerah";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const getDaerah = cache(async (id: string) => {
  try {
    if (!prisma) {
      return getFallbackDaerahById(id);
    }

    return await prisma.daerah.findUnique({
      where: { id },
      include: {
        kebudayaans: {
          orderBy: { nama: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch daerah from database, using fallback.", error);
    return getFallbackDaerahById(id);
  }
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const daerah = await getDaerah(id);

  if (!daerah) {
    return {
      title: "Daerah tidak ditemukan",
    };
  }

  return {
    title: `${daerah.nama} | Kantara`,
    description: daerah.description,
  };
}

const DaerahPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const daerah = await getDaerah(id);

  if (!daerah) {
    notFound();
  }

  return <DaerahModules daerah={daerah} />;
};

export default DaerahPage;
