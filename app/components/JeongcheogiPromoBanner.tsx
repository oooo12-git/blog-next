import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { redirectedPostTargets } from "@/lib/post-redirects";

export default function JeongcheogiPromoBanner() {
  return (
    <section className="mt-4">
      <div className="flex justify-center items-center gap-2">
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
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
        <a
          href={
            redirectedPostTargets[
              "korean-information-processing-engineer-practical-exam-strategy"
            ]
          }
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          정처기 실기 이론 공부법
        </a>
        <a
          href={redirectedPostTargets["jeongcheogi-practical-exam-review-2025-2"]}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          2025년 2회 실기 후기 및 문제 분석
        </a>
      </div>
    </section>
  );
}
