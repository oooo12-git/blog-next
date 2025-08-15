import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  interClass: string;
};

export default function Logo({ interClass }: LogoProps) {
  return (
    <div className="flex items-center">
      <Link
        href="/"
        className="flex-shrink-0 flex items-center group w-10 h-10"
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={773}
          height={773}
          className="rounded-full object-cover"
        />
        {/* <header className="flex flex-col items-center">
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
        </header> */}
      </Link>
    </div>
  );
}
