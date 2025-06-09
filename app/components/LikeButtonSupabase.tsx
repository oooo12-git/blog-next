"use client";

import { useState, useEffect } from "react";
import { toggleLike, getLikeStatus } from "@/lib/actions";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface LikeButtonSupabaseProps {
  slug: string;
  locale: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  initialCount?: number;
  initialLiked?: boolean;
}

export function LikeButtonSupabase({
  slug,
  locale,
  size = "md",
  showCount = true,
  initialCount = 0,
  initialLiked = false,
}: LikeButtonSupabaseProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // 크기별 스타일
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const containerSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  // 초기 상태 로드
  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const result = await getLikeStatus(slug);
        if (result.success) {
          setIsLiked(result.isLiked || false);
          setLikeCount(result.likeCount || 0);
        }
      } catch (error) {
        console.error("Failed to load like status:", error);
      }
    };

    loadInitialStatus();
  }, [slug]);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // 낙관적 업데이트
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likeCount + 1 : likeCount - 1;

      setIsLiked(newLikedState);
      setLikeCount(Math.max(0, newCount));

      // 하트 애니메이션 트리거
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);

      // 서버 업데이트
      const result = await toggleLike(slug, locale);

      if (result.success) {
        // 서버 결과로 상태 동기화
        setIsLiked(result.liked ?? false);
        setLikeCount(result.likeCount ?? 0);

        // 좋아요를 눌렀을 때만 감사 메시지 표시
        if (result.liked) {
          setShowThankYou(true);
          setTimeout(() => {
            setShowThankYou(false);
          }, 2000);
        }
      } else {
        // 실패 시 롤백
        setIsLiked(!newLikedState);
        setLikeCount(likeCount);
        console.error("Failed to toggle like:", result.error);
      }
    } catch (error) {
      // 에러 시 롤백
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`relative flex items-center justify-center space-x-2 ${containerSizeClasses[size]}`}
      >
        {/* 감사합니다 메시지 */}
        {showThankYou && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 animate-thank-you-arch">
            <span className="text-sm font-medium text-red-500 bg-white px-3 py-1 rounded-full shadow-lg border border-red-200">
              감사합니다!
            </span>
          </div>
        )}
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`group flex items-center space-x-1 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md p-2 border-[0.5px] ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          {/* 하트 아이콘 */}
          <div
            className={`relative ${isAnimating ? "animate-heart-beat" : ""}`}
          >
            <svg
              className={`${sizeClasses[size]} transition-all duration-300 ${
                isLiked
                  ? "text-red-500"
                  : "text-gray-400 group-hover:text-red-400"
              }`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                className={`transition-all duration-300 ${
                  !isLiked ? "group-hover:animate-pulse" : ""
                }`}
              />
            </svg>

            {/* 자동 채우기 애니메이션 (좋아요 안 눌렀을 때만) */}
            {!isLiked && (
              <svg
                className={`${sizeClasses[size]} absolute inset-0 text-red-500 animate-heart-fill-cycle`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}

            {/* hover 시 나타나는 채워진 하트 (좋아요 안 눌렀을 때만) */}
            {!isLiked && (
              <svg
                className={`${sizeClasses[size]} absolute inset-0 text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-70 z-10`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </div>

          {/* 좋아요 개수 */}
          {showCount && (
            <span
              className={`${
                inter.className
              } font-normal transition-colors duration-300 ${
                isLiked
                  ? "text-gray-600"
                  : "text-gray-600 group-hover:text-red-400"
              }`}
            >
              {likeCount.toLocaleString()}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
