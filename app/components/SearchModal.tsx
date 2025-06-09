"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PostWithSnippet } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  locale,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostWithSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("search");
  // 검색 함수
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("검색 오류:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운싱된 검색
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms 지연

    return () => clearTimeout(debounceTimer);
  }, [query, locale]);

  // 모달이 열릴 때 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedPost = results[selectedIndex];
      router.push(`/${locale}/blog/${selectedPost.slug}`);
      onClose();
    }
  };

  // 포스트 클릭 핸들러
  const handlePostClick = (slug: string) => {
    router.push(`/${locale}/blog/${slug}`);
    onClose();
  };

  // 검색어 하이라이트
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 px-2 sm:px-0">
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-sm sm:max-w-2xl bg-white gradient-hongkong-light rounded-lg shadow-xl border border-black dark:border-gray-700">
        {/* 검색 입력 */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 ">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-100 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-base sm:text-lg bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100 flex-shrink-0"></div>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-64 sm:max-h-96 overflow-y-auto">
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
              {t("noResults")}
            </div>
          )}

          {results.map((post, index) => (
            <div
              key={post.slug}
              className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                selectedIndex === index
                  ? "bg-gray-100 gradient-hongkong-light"
                  : "hover:bg-gray-50 gradient-hongkong-subtle hover:gradient-hongkong-subtle"
              }`}
              onClick={() => handlePostClick(post.slug)}
            >
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2">
                  {highlightText(post.metadata.title, query)}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {highlightText(post.metadata.description, query)}
                </p>

                {/* 본문 스니펫 표시 */}
                {post.contentSnippet && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-gray-300 dark:border-gray-600">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      본문:{" "}
                    </span>
                    {highlightText(post.contentSnippet, query)}
                  </div>
                )}

                <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.metadata.publishedAt}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="sm:inline hidden">
                    {post.metadata.timeToRead}
                    {t("timeToRead")}
                  </span>
                  {post.metadata.tags.length > 0 && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex flex-wrap gap-1">
                        {post.metadata.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs"
                          >
                            {highlightText(tag, query)}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 도움말 */}
        <div className="p-2 sm:p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <div className="hidden sm:block dark:text-gray-300">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded ">
                ↑↓
              </kbd>{" "}
              {t("explore")},{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                Enter
              </kbd>{" "}
              {t("select")},{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                Esc
              </kbd>{" "}
              {t("close")}
            </div>
            <div className="sm:hidden text-center w-full">{t("tab")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
