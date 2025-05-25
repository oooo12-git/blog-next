import { Inter } from "next/font/google";
import Link from "next/link";
import Visitors from "./Visitors";

const inter = Inter({ subsets: ["latin"] });

export default function Footer() {
  return (
    <footer
      className={`flex-col text-neutral-400 mt-10 font-light text-xs ${inter.className}`}
    >
      {/* 네비게이션 링크 섹션 */}
      <div className="flex items-center justify-between rounded-[10px] bg-[#ECEAEA] dark:bg-gray-800 border border-black border-opacity-50 h-[30px] px-50 text-black">
        <Link href="/about">About</Link>
        <Link href="/learning">Learning</Link>
        <Link href="/opinion">Opinion</Link>
      </div>
      {/* 푸터 정보 섹션 */}
      <div className="flex justify-between mt-3 px-30">
        <Link href="/">KIM JAE HYUN</Link>
        {/* 방문자 수 표시 */}
        <Visitors />
        {/* 소스 코드 링크 */}
        <a href="https://github.com/oooo12-git/blog-next" target="_blank">
          source
        </a>
      </div>
    </footer>
  );
}
