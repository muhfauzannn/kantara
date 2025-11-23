"use client";

import { useState } from "react";
import Image from "next/image";

interface DaerahData {
  id: string;
  nama: string;
  description: string;
  latitude: number;
  longitude: number;
  icon: string | null;
  backgroundImg: string | null;
  images: string[];
  kebudayaans: Array<{
    id: string;
    nama: string;
    jenis: string;
    images: string[];
  }>;
}

interface DaerahPopupProps {
  daerah: DaerahData;
}

export default function DaerahPopup({ daerah }: DaerahPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = daerah.images.length > 0 ? daerah.images : [];

  const nextImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + allImages.length) % allImages.length
      );
    }
  };

  return (
    <div className="w-80 max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{daerah.nama}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {daerah.description}
        </p>
      </div>

      {/* Image Gallery */}
      {allImages.length > 0 && (
        <div className="mb-3">
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`${allImages[currentImageIndex]}`}
              alt={`${daerah.nama} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback for broken images - try different paths
                const img = e.target as HTMLImageElement;
                const originalSrc = allImages[currentImageIndex];

                // Try with different base paths
                if (
                  img.src.includes("/suku/") ||
                  img.src.includes("/rumah/") ||
                  img.src.includes("/makanan/") ||
                  img.src.includes("/kesenian/")
                ) {
                  return; // Already has correct path
                }

                // Try to determine category and set correct path
                if (originalSrc.includes("suku")) {
                  img.src = `/suku/${originalSrc}`;
                } else if (originalSrc.includes("rumah")) {
                  img.src = `/rumah/${originalSrc}`;
                } else if (originalSrc.includes("makanan")) {
                  img.src = `/makanan/${originalSrc}`;
                } else if (originalSrc.includes("kesenian")) {
                  img.src = `/kesenian/${originalSrc}`;
                } else {
                  img.src = "/placeholder-image.svg";
                }
              }}
            />

            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1}/{allImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kebudayaan List */}
      {daerah.kebudayaans.length > 0 && (
        <div className="border-t pt-2">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Kebudayaan ({daerah.kebudayaans.length})
          </h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {daerah.kebudayaans.slice(0, 3).map((kebudayaan) => (
              <div key={kebudayaan.id} className="text-xs text-gray-600">
                <span className="font-medium">{kebudayaan.nama}</span>
                <span className="ml-2 text-gray-500">
                  ({kebudayaan.jenis.replace(/_/g, " ")})
                </span>
              </div>
            ))}
            {daerah.kebudayaans.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                dan {daerah.kebudayaans.length - 3} lainnya...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
