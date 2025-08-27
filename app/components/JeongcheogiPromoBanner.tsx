import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function JeongcheogiPromoBanner() {
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Link
        href="https://jeongcheogi.edugamja.com/exam-registration/jcg-test-center"
        passHref
        target="_blank"
        rel="noopener"
        className="w-full max-w-2xl"
      >
        <Button
          variant="outline"
          className="bg-amber-50 dark:bg-amber-900 text-sm md:text-base font-semibold text-black dark:text-white h-13 w-[180px] md:w-full cursor-pointer"
        >
          <Image
            src="/jeongcheogiBanner/test-center_gamza.webp"
            alt="정처기 실기 시험장 찾기 - 정처기 감자"
            width={40}
            height={40}
            className="mr-0 md:mr-3"
          />
          <span className="text-wrap md:text-nowrap">
            정처기 실기 시험장 찾기
          </span>
        </Button>
      </Link>
      <Link
        href="https://jeongcheogi.edugamja.com/exam-registration/jeongcheogi-application"
        passHref
        target="_blank"
        rel="noopener"
        className="w-full max-w-2xl"
      >
        <Button
          variant="outline"
          className="bg-amber-50 dark:bg-amber-900 text-sm md:text-base font-semibold text-black dark:text-white h-13 w-[180px] md:w-full cursor-pointer"
        >
          <Image
            src="/jeongcheogiBanner/calendar_gamza.webp"
            alt="정처기 실기 시험 원서 접수 일정 - 정처기 감자"
            width={40}
            height={40}
            className="mr-0 md:mr-3"
          />
          <span className="text-wrap md:text-nowrap">
            정처기 원서 접수 일정
          </span>
        </Button>
      </Link>
    </div>
  );
}
