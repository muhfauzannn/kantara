import { navbarItems } from "../Navbar/const";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-red-700 flex justify-between text-white py-12 max-lg:py-10 px-12 max-lg:px-10 max-md:px-8 max-sm:px-6">
      <div>
        <h1 className="text-5xl max-lg:text-4xl max-md:text-3xl font-gotu">
          Kantara
        </h1>
      </div>

      <div className="flex flex-col gap-1 px-20">
        {navbarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:underline text-sm transition-all"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
