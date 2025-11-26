import { Suspense } from "react";
import MapModules from "@/modules/MapModules";

const MapLoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
      <p className="text-gray-600">Memuat peta budaya Indonesia...</p>
    </div>
  </div>
);

const Page = () => {
  return (
    <Suspense fallback={<MapLoadingFallback />}>
      <MapModules />
    </Suspense>
  );
};

export default Page;
