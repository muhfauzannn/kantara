"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search, Image as ImageIcon } from "lucide-react";
import { useState, FormEvent, DragEvent, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleImageSearch = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar");
      return;
    }

    setIsSearching(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/daerah/search/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const searchId = result.searchId || Date.now().toString();
        sessionStorage.setItem(
          `image-search-${searchId}`,
          JSON.stringify(result)
        );
        router.push(`/search?imageSearch=${searchId}`);
      } else {
        alert("Gagal mencari berdasarkan gambar: " + result.error);
      }
    } catch (error) {
      console.error("Error searching by image:", error);
      alert("Terjadi kesalahan saat mencari berdasarkan gambar");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageSearch(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSearch(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="min-h-screen relative flex items-center">
      <Image
        src="/bg-landing.png"
        alt="Background Landing"
        fill
        className="object-cover -z-10"
      />
      <div className="bg-black/30 w-full h-full absolute -z-9"></div>
      <div className="z-0 flex flex-col gap-6 w-1/2 max-lg:w-full text-white px-16 max-lg:px-14 max-md:px-4">
        <div className="max-lg:text-center">
          <h1 className="font-gotu text-6xl">Kantara</h1>
          <p>
            Melalui peta interaktif dan dokumentasi budaya yang lengkap,
            dirancang untuk menghidupkan kembali warisan tiap provinsi.
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 transition-all ${
              isDragging ? "ring-2 ring-white rounded-md" : ""
            }`}
          >
            <Input
              className="w-full bg-white text-black placeholder:text-black/50"
              placeholder={
                isSearching
                  ? "Mencari..."
                  : isDragging
                  ? "Lepaskan gambar..."
                  : "Cari daerah atau drop gambar..."
              }
              value={searchQuery}
              rightIcon={<Search className="w-5 h-5 text-black" />}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
          </div>
          <button
            type="button"
            onClick={openFileDialog}
            className="p-2 bg-white rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSearching}
            title="Upload gambar"
          >
            <ImageIcon className="w-5 h-5 text-black" />
          </button>
          {/* <button
            type="submit"
            className="p-2 bg-white rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSearching}
            title="Cari"
          >
            <Search className="w-5 h-5 text-black" />
          </button> */}
        </form>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </section>
  );
};

export default Hero;
