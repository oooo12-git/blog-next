import { Inter } from "next/font/google";
import Logo from "./Logo";
import Menu from "./Menu";
import Search from "./Search";

const inter = Inter({
  subsets: ["latin"],
});

interface NavbarProps {
  locale?: string;
}

export default async function Navbar({ locale = "ko" }: NavbarProps) {
  return (
    <nav className="bg-white dark:bg-black h-12 sm:h-16 flex justify-between items-center px-2 sm:px-4">
      <Logo interClass={inter.className} />
      <Search interClass={inter.className} locale={locale} />
      <Menu interClass={inter.className} />
    </nav>
  );
}
