"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Loader2, Sparkles } from "lucide-react";

interface Kebudayaan {
  id: string;
  nama: string;
  jenis: string;
  images: string[];
}

interface Daerah {
  id: string;
  nama: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  icon: string | null;
  backgroundImg: string | null;
  images: string[];
  kebudayaans: Kebudayaan[];
  aiExplanation?: string | null;
}

interface SearchResponse {
  success: boolean;
  data: Daerah[];
  matchedBy: string;
  summary: string;
  error?: string;
}

const SearchModules = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");

  const [results, setResults] = useState<Daerah[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [matchedBy, setMatchedBy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async (searchQuery: string) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/daerah/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data: SearchResponse = await response.json();

        if (data.success) {
          setResults(data.data);
          setSummary(data.summary);
          setMatchedBy(data.matchedBy);
        } else {
          setError(data.error || "Terjadi kesalahan saat mencari");
        }
      } catch (err) {
        setError("Gagal melakukan pencarian");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults(query);
    } else {
      setLoading(false);
    }
  }, [query, router]);

  const getMainImage = (daerah: Daerah): string | null => {
    if (daerah.images && daerah.images.length > 0) {
      return daerah.images[0];
    }
    if (daerah.backgroundImg) {
      return daerah.backgroundImg;
    }
    return null;
  };

  if (!query) {
    return (
      <div className="min-h-screen pt-24 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Cari Daerah</h1>
          <p className="text-gray-600">
            Gunakan form pencarian di navbar untuk mencari daerah
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hasil Pencarian</h1>
          <p className="text-gray-600">
            Pencarian untuk: <span className="font-semibold">{query}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-red-700 mb-4" />
            <p className="text-gray-600">Mencari daerah...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Summary */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                matchedBy === "gemini_ai"
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p className="text-sm">
                {matchedBy === "gemini_ai" && (
                  <span className="inline-flex items-center gap-2 text-blue-700 font-semibold mb-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Berdasarkan pencarian
                  </span>
                )}
              </p>
              <p className="text-gray-700">{summary}</p>
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((daerah) => (
                  <Link
                    key={daerah.id}
                    href={`/map?daerah=${daerah.id}`}
                    className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-700"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full bg-linear-to-br from-red-700 to-red-900">
                      {getMainImage(daerah) ? (
                        <Image
                          src={getMainImage(daerah)!}
                          alt={daerah.nama}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {daerah.nama.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-red-700 transition-colors">
                        {daerah.nama}
                      </h3>

                      {/* AI Explanation */}
                      {daerah.aiExplanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                          <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Mengapa cocok?
                          </p>
                          <p className="text-sm text-blue-800">
                            {daerah.aiExplanation}
                          </p>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {daerah.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-bold mb-2">
                  Tidak Ada Hasil Ditemukan
                </h2>
                <p className="text-gray-600 mb-4">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchModules;
