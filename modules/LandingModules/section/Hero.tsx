import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Search } from "lucide-react";

const Hero = () => {
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
        <Input
          className="w-full bg-white text-black placeholder:text-black/50"
          placeholder="Cari..."
          rightIcon={<Search className="w-5 h-5 text-black/50" />}
        />
      </div>
    </section>
  );
};

export default Hero;
