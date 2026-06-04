"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// 블로그 섹션(목록 / 포스트 / 태그)의 렌더 에러를 처리하는 에러 바운더리.
// 이전에 tag 페이지의 try/catch가 잡아주던 동기 렌더 에러를 여기서 폴백 UI로 대체한다.
export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = params?.locale === "en" ? "en" : "ko";

  useEffect(() => {
    console.error("Blog section render error:", error);
  }, [error]);

  const messages = {
    ko: {
      description: "페이지를 불러오는 중 오류가 발생했습니다.",
      retry: "다시 시도",
      backToBlog: "모든 포스트 보기",
    },
    en: {
      description: "An error occurred while loading the page.",
      retry: "Try again",
      backToBlog: "View all posts",
    },
  }[locale];

  return (
    <div className="text-center py-12">
      <p className="text-[#706E6E] text-lg mb-4 dark:text-neutral-200">
        {messages.description}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors dark:bg-gray-800 dark:text-neutral-200 dark:hover:bg-gray-900"
        >
          {messages.retry}
        </button>
        <Link
          href={`/${locale}/blog`}
          className="inline-block border border-black px-6 py-2 rounded-md hover:bg-[#DDDCDC] transition-colors dark:border-neutral-200 dark:text-neutral-200 dark:hover:bg-gray-900"
        >
          {messages.backToBlog}
        </Link>
      </div>
    </div>
  );
}
