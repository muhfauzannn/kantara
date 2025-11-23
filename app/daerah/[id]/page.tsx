import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DaerahModules from "@/modules/DaerahModules";
import { PrismaClient } from "@/lib/generated/prisma/client";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

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
