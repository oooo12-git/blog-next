"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef, useCallback } from "react";

interface Post {
  slug: string;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    publishedAt: string;
  };
}

interface NotRelatedPostsProps {
  tags: string[];
  posts: Post[];
  currentSlug: string;
}

export default function NotRelatedPosts({
  tags,
  posts,
  currentSlug,
}: NotRelatedPostsProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("notRelatedPosts");
  // 관련 글들을 제외한 나머지 글들 필터링 (전체 리스트)
  const getAllNotRelatedPosts = useCallback(() => {
    // RelatedTagPosts에서 보여주는 모든 관련 글들의 slug를 수집
    const getRelatedPostSlugs = () => {
      const relatedSlugs = new Set<string>();

      tags.forEach((tag) => {
        const tagPosts = posts
          .filter((post) => {
            if (post.slug === currentSlug) return false;
            return post.metadata.tags.includes(tag);
          })
          .slice(0, 5);

        tagPosts.forEach((post) => relatedSlugs.add(post.slug));
      });

      return relatedSlugs;
    };

    const relatedSlugs = getRelatedPostSlugs();

    return posts.filter((post) => {
      // 현재 글 제외
      if (post.slug === currentSlug) return false;
      // 관련 글들 제외
      if (relatedSlugs.has(post.slug)) return false;
      return true;
    });
  }, [posts, currentSlug, tags]);

  const allNotRelatedPosts = getAllNotRelatedPosts();
  const visiblePosts = allNotRelatedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allNotRelatedPosts.length;

  // 더 많은 포스트 로드 함수
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // 실제 로딩 시뮬레이션을 위한 약간의 지연
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsLoading(false);
    }, 300);
  }, [isLoading, hasMore]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: "100px", // 100px 전에 미리 로드
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  // 보여줄 글이 없으면 컴포넌트를 렌더링하지 않음
  if (allNotRelatedPosts.length === 0) return null;

  return (
    <div className="mt-8 mx-2 sm:mx-0 dark:text-white">
      <div className="flex flex-col rounded-md border-[0.5px] p-3 sm:p-4 dark:border-neutral-400">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-[#333] dark:text-neutral-200">
            {t("notRelatedPosts")}
          </h3>
        </div>

        <div className="flex flex-col space-y-1">
          {visiblePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col"
            >
              <div className="w-full flex flex-row space-x-2 items-center justify-between">
                <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums font-thin text-xs text-center dark:hover:text-gray-200">
                  {post.metadata.publishedAt}
                </p>
                <p className="w-[250px] sm:w-[550px] text-neutral-900 dark:text-neutral-100 tracking-tight truncate font-extralight text-sm dark:hover:text-gray-300">
                  {post.metadata.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          </div>
        )}

        {/* Intersection Observer 타겟 */}
        {hasMore && <div ref={observerRef} className="h-4 mt-2" />}

        {/* 더 이상 로드할 글이 없을 때 */}
        {!hasMore && allNotRelatedPosts.length > 10 && (
          <div className="text-center mt-4 text-xs sm:text-sm text-gray-500">
            {t("allPostsLoaded")}
          </div>
        )}
      </div>
    </div>
  );
}
