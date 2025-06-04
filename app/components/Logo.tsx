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
      <Link href="/" className="flex-shrink-0 flex items-center">
        <header className="flex flex-col items-center">
          <h1
            className={`text-lg sm:text-2xl ${rocknRollOne.className} text-gray-900 dark:text-white`}
          >
            金宰賢
          </h1>
          <h2
            className={`text-xs sm:text-xs text-gray-700 dark:text-gray-300 ${interClass} leading-tight`}
          >
            KIM JAE HYUN
          </h2>
        </header>
      </Link>
    </div>
  );
}
