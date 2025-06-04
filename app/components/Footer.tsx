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
      className={`flex-col text-neutral-400 mt-10 font-light text-xs ${inter.className}`}
    >
      {/* 네비게이션 링크 섹션 */}
      <div className="flex items-center justify-between rounded-[10px] bg-[#ECEAEA] dark:bg-gray-800 border border-black border-opacity-50 h-[30px] px-50 text-black">
        <Link href="/about">{tMenu("items.about")}</Link>
        <Link href="/blog">{tMenu("items.blog")}</Link>
        <Link href="/stat">{tMenu("items.stat")}</Link>
      </div>
      {/* 푸터 정보 섹션 */}
      <div className="flex justify-between mt-3 mb-10 px-30">
        <Link href="/">KIM JAE HYUN</Link>
        {/* 방문자 수 표시 */}
        <Visitors />
        {/* 소스 코드 링크 */}
        <a href="https://github.com/oooo12-git/blog-next" target="_blank">
          {tFooter("source")}
        </a>
      </div>
    </footer>
  );
}
