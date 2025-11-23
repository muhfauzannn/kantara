import Image from "next/image";

const Hero = () => {
  return (
    <section className="min-h-screen relative flex justify-center items-center">
      <Image
        src="/bg-landing.png"
        alt="Background Landing"
        fill
        className="object-cover -z-10"
      />
      <div className="bg-black/30 w-full h-full absolute -z-9"></div>
      <div className="z-0 text-white"></div>
    </section>
  );
};

export default Hero;
