"use client";

import { navbarItems } from "./const";
import Link from "next/link";
import { Input } from "../../ui/input";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <div className="hidden md:block">
          <Input
            className="w-50 bg-white text-black placeholder:text-black/50"
            placeholder="Cari..."
            rightIcon={<Search className="w-5 h-5 text-black" />}
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
              <Input
                className="w-full bg-white text-black placeholder:text-black/50"
                placeholder="Cari..."
                rightIcon={<Search className="w-5 h-5 text-black" />}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
