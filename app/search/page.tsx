import { Suspense } from "react";
import SearchModules from "@/modules/SearchModules";

const SearchLoadingFallback = () => (
  <div className="min-h-screen pt-24 pb-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat hasil pencarian...</p>
      </div>
    </div>
  </div>
);

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SearchModules />
    </Suspense>
  );
}
