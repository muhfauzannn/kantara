"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Import Map component dengan dynamic untuk menghindari SSR issues
const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat peta budaya Indonesia...</p>
      </div>
    </div>
  ),
});

const MapModules = () => {
  const searchParams = useSearchParams();
  const daerahId = searchParams.get("daerah");

  return (
    <div className="w-full h-screen pt-16">
      <Map selectedDaerahId={daerahId} />
    </div>
  );
};

export default MapModules;
