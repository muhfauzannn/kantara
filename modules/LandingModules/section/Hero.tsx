"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search } from "lucide-react";

const Hero = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
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
        <form onSubmit={handleSubmit}>
          <Input
            className="w-full bg-white text-black placeholder:text-black/50"
            placeholder="Cari..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            rightIcon={
              <button
                type="submit"
                className="p-1 rounded-md hover:bg-black/10 transition-colors"
              >
                <Search className="w-5 h-5 text-black/60" />
              </button>
            }
          />
        </form>
      </div>
    </section>
  );
};

export default Hero;
