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
        const result = await incrementViewCount(slug, locale);
        if (result.success && result.viewCount) {
          setViewCount(result.viewCount);
        }
        setHasIncremented(true);
      } catch (error) {
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
