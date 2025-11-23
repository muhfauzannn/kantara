import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DaerahModules from "@/modules/DaerahModules";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const getDaerah = cache(async (id: string) => {
  return prisma.daerah.findUnique({
    where: { id },
    include: {
      kebudayaans: {
        orderBy: { nama: "asc" },
      },
    },
  });
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
