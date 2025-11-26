import { Search, Bot, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Feature = [
  {
    title: "Peta Budaya Interaktif",
    href: "/map",
    icon: <Search className="w-10 h-10" />,
  },
  {
    title: "Virtual Tour Nusantara",
    href: "/virtual-tour",
    icon: <Compass className="w-10 h-10" />,
  },
  {
    title: "Chatbot Budaya AI",
    href: "/chatbot",
    icon: <Bot className="w-10 h-10" />,
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="grid grid-cols-[1.3fr_1fr] max-lg:grid-cols-1 min-h-screen"
    >
      <div className="flex flex-col gap-5 justify-center px-16 max-lg:px-14 max-md:px-4">
        <div className="relative w-fit max-lg:self-center">
          <h1 className="px-4 font-gotu text-8xl max-lg:text-6xl max-md:text-4xl text-red-700">
            Kantara
          </h1>
          <div className="absolute bottom-0 -z-1 w-full h-1/2 bg-yellow-100"></div>
        </div>
        <p className="text-justify max-lg:text-center">
          Kantara AI adalah platform berbasis web yang memanfaatkan kecerdasan
          buatan untuk melestarikan dan mengeksplorasi budaya Indonesia secara
          interaktif. Melalui peta dinamis, sistem rekomendasi cerdas, dan
          chatbot budaya, pengguna dapat menelusuri, memahami, dan terhubung
          dengan kekayaan budaya Nusantara. Kantara AI menjadi jembatan antara
          tradisi dan teknologi, menghadirkan warisan budaya Indonesia dalam
          pengalaman digital yang kontekstual dan menarik.
        </p>
        <div className="flex gap-5 max-lg:justify-center">
          {Feature.map((feature) => (
            <Card
              key={feature.title}
              title={feature.title}
              href={feature.href}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
      <div className="relative w-full flex flex-col justify-center h-full max-lg:hidden">
        <div className="w-full relative h-[80%]">
          <Image
            src="/about.png"
            alt="About Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </section>
  );
};
export default About;

export const Card = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="flex shrink-0 flex-col w-40 text-center text-white bg-red-500 hover:bg-red-400 transition-colors justify-center px-5 h-40 gap-2 items-center"
    >
      {icon}
      {title}
    </Link>
  );
};
