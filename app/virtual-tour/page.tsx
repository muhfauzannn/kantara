"use client";

import dynamic from "next/dynamic";

const VirtualTourModules = dynamic(
  () => import("@/modules/VirtualTourModules"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat virtual tour...</p>
      </div>
    ),
  }
);

export default function VirtualTourPage() {
  return <VirtualTourModules />;
}
