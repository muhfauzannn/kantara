"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundtrackRef = useRef<HTMLAudioElement | null>(null);
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

  const handleAIAssistant = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop event propagation to prevent popup from closing
    e.stopPropagation();
    e.preventDefault();

    try {
      // If audio is already playing, stop it
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Stop soundtrack too
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);

      // Call the TTS API with daerah information
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: daerah.description,
          daerahNama: daerah.nama,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      // Convert response to blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Setup soundtrack
      const soundtrack = new Audio("/soundtrack.mp3");
      soundtrack.loop = true;
      soundtrack.volume = 0.1; // Set volume to 10% so it doesn't overpower the narration
      soundtrackRef.current = soundtrack;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        // Stop soundtrack when narration ends
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        // Stop soundtrack on error
        if (soundtrackRef.current) {
          soundtrackRef.current.pause();
          soundtrackRef.current.currentTime = 0;
        }
        alert("Gagal memutar audio");
      };

      // Play both audio and soundtrack
      await Promise.all([audio.play(), soundtrack.play()]);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
      alert("Terjadi kesalahan saat memutar audio");
    }
  };

  return (
    <div className="w-80 max-w-sm">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 mb-1">
              {daerah.nama}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {daerah.description}
            </p>
          </div>
        </div>
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
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAIAssistant}
          disabled={isLoading}
          className={`shrink-0 flex justify-center py-2.5 rounded-lg w-full transition-all ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          title={
            isPlaying
              ? "Stop AI Assistant"
              : "Dengarkan penjelasan dari AI Assistant"
          }
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <div className="text-base">Kata AI</div>
          )}
        </button>
        <Link href={`/daerah/${daerah.id}`}>
          <Button className="w-full cursor-pointer" variant={"ghost"}>
            Lihat Selengkapnya
          </Button>
        </Link>
      </div>
    </div>
  );
}
