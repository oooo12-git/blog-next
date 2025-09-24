"use client";

import { useEffect, useState } from "react";
import { incrementViewCount } from "@/lib/actions";

interface ViewCounterProps {
  slug: string;
  locale: string;
  initialCount: number;
  viewCountLabel: string;
}

export default function ViewCounter({
  slug,
  locale,
  initialCount,
  viewCountLabel,
}: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    // 중복 호출 방지
    if (hasIncremented) return;

    const incrementCount = async () => {
      try {
        // 1. 낙관적 업데이트: 즉시 조회수 증가
        setViewCount((prev) => prev + 1);
        setHasIncremented(true);

        // 2. 서버 업데이트
        const result = await incrementViewCount(slug, locale);
        if (result.success && result.viewCount) {
          // 3. 성공 시 서버 결과로 동기화
          setViewCount(result.viewCount);
        } else {
          // 4. 실패 시 롤백
          setViewCount((prev) => Math.max(0, prev - 1));
          console.error("Failed to increment view count:", result.error);
        }
      } catch (error) {
        // 5. 에러 시 롤백
        setViewCount((prev) => Math.max(0, prev - 1));
        console.error("Failed to increment view count:", error);
        setHasIncremented(true);
      }
    };

    // 페이지 로드 후 조회수 증가
    incrementCount();
  }, [slug, locale, hasIncremented]);

  return (
    <div>
      {viewCountLabel}: {viewCount.toLocaleString()}
    </div>
  );
}
