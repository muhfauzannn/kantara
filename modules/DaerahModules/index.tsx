import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@/lib/generated/prisma/client";
import {
  Leaf,
  House,
  Utensils,
  LineSquiggle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "../LandingModules/section/About";

type DaerahWithRelations = Prisma.DaerahGetPayload<{
  include: { kebudayaans: true };
}>;

interface DaerahModulesProps {
  daerah: DaerahWithRelations;
}

const category = [
  {
    title: "Suku dan Adat",
    href: "/#",
    icon: <Leaf className="w-10 h-10" />,
  },
  {
    title: "Rumah Adat",
    href: "/#",
    icon: <House className="w-10 h-10" />,
  },
  {
    title: "Makanan Khas",
    href: "/#",
    icon: <Utensils className="w-10 h-10" />,
  },
  {
    title: "Kesenian Daerah",
    href: "/#",
    icon: <LineSquiggle className="w-10 h-10" />,
  },
];

const DaerahModules = ({ daerah }: DaerahModulesProps) => {
  const heroImage = daerah.backgroundImg ?? daerah.images[0];
  const galleryImages = daerah.images.slice(0, 4);
  const museumItems = daerah.kebudayaans;

  // Duplicate images for infinite scroll
  const duplicatedImages = [...galleryImages, ...galleryImages];

  return (
    <div className="flex flex-col gap-10 pb-10">
      <section className="min-h-screen relative flex items-center">
        <Image
          src="/daerah-detail.png"
          alt={daerah.nama}
          fill
          className="object-cover "
        />
        <div className="bg-black/30 w-full h-full absolute"></div>
        <div className="z-0 flex flex-col gap-6 w-1/2 max-lg:w-full text-white px-16 max-lg:px-14 max-md:px-4">
          <div className="max-lg:text-center">
            <h1 className="font-gotu text-6xl">{daerah.nama}</h1>
            <p>{daerah.description}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
        <p className="font-bold text-xl">Kebudayaan {daerah.nama}</p>
        <div className="flex gap-5 max-lg:justify-center overflow-y-auto">
          {category.map((category) => (
            <Card
              key={category.title}
              title={category.title}
              href={category.href}
              icon={category.icon}
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
        <div className="flex items-center justify-between gap-4 overflow-y-auto">
          <p className="font-bold text-xl">Explore</p>
          {museumItems.length > 4 && (
            <Link
              href="/map"
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Lihat selengkapnya
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {museumItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Belum ada data museum untuk daerah ini.
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-2">
            {museumItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative aspect-4/3 w-full">
                  <Image
                    src={item.images[0]}
                    alt={item.nama}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.nama}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
          <p className="font-bold text-xl">Jelajahi Daerah Ini</p>
        </div>
        {galleryImages.length === 0 ? (
          <div className="mx-12 max-lg:mx-10 max-md:mx-8 max-sm:mx-6 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Belum ada dokumentasi visual untuk daerah ini.
          </div>
        ) : (
          <div className="flex gap-[1.5vw] animate-scroll-left pointer-events-none">
            {[...duplicatedImages, ...duplicatedImages].map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="w-screen max-w-[717px] lg:max-w-[70vw] aspect-video grid grid-cols-3 grid-rows-2 gap-[1.5vw] shrink-0"
              >
                {/* Top Left - Span 2 columns */}
                <div className="col-span-2 relative overflow-hidden rounded-[1.5vw] bg-slate-200">
                  <Image
                    src={galleryImages[0 % galleryImages.length]}
                    alt={`${daerah.nama} - Eksplorasi 1`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 70vw"
                  />
                </div>

                {/* Top Right - 1 column */}
                <div className="relative overflow-hidden rounded-[1.5vw] bg-slate-200">
                  <Image
                    src={galleryImages[1 % galleryImages.length]}
                    alt={`${daerah.nama} - Eksplorasi 2`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 23vw"
                  />
                </div>

                {/* Bottom Left - 1 column */}
                <div className="relative overflow-hidden rounded-[1.5vw] bg-slate-200">
                  <Image
                    src={galleryImages[2 % galleryImages.length]}
                    alt={`${daerah.nama} - Eksplorasi 3`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 23vw"
                  />
                </div>

                {/* Bottom Right - Span 2 columns */}
                <div className="col-span-2 relative overflow-hidden rounded-[1.5vw] bg-slate-200">
                  <Image
                    src={galleryImages[3 % galleryImages.length]}
                    alt={`${daerah.nama} - Eksplorasi 4`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 70vw"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DaerahModules;
