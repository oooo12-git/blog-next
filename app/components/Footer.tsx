import { Inter } from "next/font/google";
import { Link } from "../../i18n/navigation";
import Visitors from "./Visitors";
import { useTranslations } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export default function Footer() {
  const tMenu = useTranslations("menu");
  const tFooter = useTranslations("footer");

  return (
    <footer
      className={`flex-col text-neutral-400 mt-6 sm:mt-10 font-light text-xs sm:text-xs ${inter.className}`}
    >
      {/* 네비게이션 링크 섹션 */}
      <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between rounded-[10px] bg-[#ECEAEA] border border-black border-opacity-50 h-[28px] sm:h-[30px] px-20 sm:px-50 mx-2 text-black dark:text-white text-xs sm:text-sm gradient-hongkong-night-no-hover">
        <Link
          href="/about"
          className="px-2 sm:px-0 py-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-left sm:text-center"
        >
          {tMenu("items.about")}
        </Link>
        <Link
          href="/blog"
          className="px-2 sm:px-0 py-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-center"
        >
          {tMenu("items.blog")}
        </Link>
        {/* <Link
          href="/stat"
          className="px-2 sm:px-0 py-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-right sm:text-center"
        >
          {tMenu("items.stat")}
        </Link> */}
      </div>

      {/* 푸터 정보 섹션 */}
      <div className="flex flex-row justify-between items-center mt-3 mb-3 sm:mb-10 px-3 sm:px-6 text-center sm:text-left">
        {/* KIM JAE HYUN - 첫 번째 */}
        <div className="flex justify-start items-center">
          <Link
            href="/"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            KIM JAE HYUN
          </Link>
        </div>

        {/* 방문자 수 - 중간 */}
        <div className="flex justify-center items-center">
          <Visitors />
        </div>

        {/* 소스코드 링크 - 마지막 */}
        <div className="flex justify-end items-center">
          <a
            href="https://github.com/oooo12-git/blog-next"
            target="_blank"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {tFooter("source")}
          </a>
        </div>
      </div>
    </footer>
  );
}
