import Link from "next/link";
import { RocknRoll_One } from "next/font/google";

const rocknRollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

type LogoProps = {
  interClass: string;
};

export default function Logo({ interClass }: LogoProps) {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex-shrink-0 flex items-center group">
        <header className="flex flex-col items-center">
          <p
            className={`text-lg sm:text-2xl ${rocknRollOne.className} text-gray-900 dark:text-white dark:group-hover:text-gray-200 transition-colors duration-200`}
          >
            金宰賢
          </p>
          <p
            className={`text-xs sm:text-xs text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-400 ${interClass} leading-tight transition-colors duration-200`}
          >
            KIM JAA HYUN
          </p>
        </header>
      </Link>
    </div>
  );
}
