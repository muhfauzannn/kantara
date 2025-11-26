"use client";

import { navbarItems } from "./const";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "../../ui/input";
import { Search, Menu, X, Image as ImageIcon } from "lucide-react";
import { useState, FormEvent, DragEvent, ChangeEvent, useRef } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleImageSearch = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar");
      return;
    }

    setIsSearching(true);
    setIsMenuOpen(false);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/daerah/search/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to search page with image search results
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
    <nav className="fixed top-0 z-100 left-0 right-0 py-4 bg-red-700 text-white px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl max-lg:text-2xl max-md:text-xl font-gotu z-20 relative">
          Kantara
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          {navbarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 hover:underline transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block relative">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`transition-all ${
                isDragging ? "ring-2 ring-white rounded-md" : ""
              }`}
            >
              <Input
                className="w-50 bg-white text-black placeholder:text-black/50"
                placeholder={
                  isSearching
                    ? "Mencari..."
                    : isDragging
                    ? "Lepaskan gambar..."
                    : "Cari daerah atau drop gambar..."
                }
                value={searchQuery}
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
            <button
              type="submit"
              className="p-2 bg-white rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSearching}
              title="Cari"
            >
              <Search className="w-5 h-5 text-black" />
            </button>
          </form>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-20 relative"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden transition-all fixed inset-0 bg-red-700 z-10 flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center space-y-8">
            {/* Mobile Navigation Links */}
            {navbarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl hover:underline transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Search */}
            <div className="w-80 max-w-[80vw]">
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
                <button
                  type="submit"
                  className="p-2 bg-white rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSearching}
                  title="Cari"
                >
                  <Search className="w-5 h-5 text-black" />
                </button>
              </form>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
