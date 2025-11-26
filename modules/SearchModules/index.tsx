"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Sparkles, ImageIcon } from "lucide-react";

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
  aiConfidence?: string | null;
}

interface SearchResponse {
  success: boolean;
  data: Daerah[];
  matchedBy: string;
  summary: string;
  imageDescription?: string;
  error?: string;
}

const SearchModules = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");
  const imageSearchId = searchParams.get("imageSearch");

  const [results, setResults] = useState<Daerah[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [matchedBy, setMatchedBy] = useState("");
  const [imageDescription, setImageDescription] = useState("");
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

    const loadImageSearchResults = () => {
      try {
        setLoading(true);
        setError("");

        const storedData = sessionStorage.getItem(
          `image-search-${imageSearchId}`
        );
        if (!storedData) {
          setError("Data pencarian gambar tidak ditemukan");
          setLoading(false);
          return;
        }

        const data: SearchResponse = JSON.parse(storedData);

        if (data.success) {
          setResults(data.data);
          setSummary(data.summary);
          setMatchedBy(data.matchedBy);
          setImageDescription(data.imageDescription || "");
        } else {
          setError(data.error || "Terjadi kesalahan saat mencari");
        }
      } catch (err) {
        setError("Gagal memuat hasil pencarian gambar");
        console.error("Image search error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (imageSearchId) {
      loadImageSearchResults();
    } else if (query) {
      fetchSearchResults(query);
    } else {
      setLoading(false);
    }
  }, [query, imageSearchId, router]);

  const getMainImage = (daerah: Daerah): string | null => {
    if (daerah.images && daerah.images.length > 0) {
      return daerah.images[0];
    }
    if (daerah.backgroundImg) {
      return daerah.backgroundImg;
    }
    return null;
  };

  if (!query && !imageSearchId) {
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
          {imageSearchId ? (
            <div className="space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Pencarian berdasarkan gambar
              </p>
              {imageDescription && (
                <p className="text-sm text-gray-500 italic">
                  &ldquo;{imageDescription}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Pencarian untuk: <span className="font-semibold">{query}</span>
            </p>
          )}
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
                matchedBy === "gemini_ai" || matchedBy === "gemini_vision"
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p className="text-sm">
                {(matchedBy === "gemini_ai" ||
                  matchedBy === "gemini_vision") && (
                  <span className="inline-flex items-center gap-2 text-red-700 font-semibold mb-1">
                    {matchedBy === "gemini_vision"
                      ? "Hasil analisis gambar dengan AI"
                      : "Berdasarkan pencarian AI"}
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
                    className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 rounded-b-lg overflow-hidden w-full bg-linear-to-br from-red-700 to-red-900">
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
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Mengapa cocok?
                            </p>
                            {daerah.aiConfidence && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  daerah.aiConfidence === "high"
                                    ? "bg-green-100 text-green-700"
                                    : daerah.aiConfidence === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {daerah.aiConfidence === "high"
                                  ? "Sangat Cocok"
                                  : daerah.aiConfidence === "medium"
                                  ? "Cukup Cocok"
                                  : "Mungkin Cocok"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-brown-500">
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
