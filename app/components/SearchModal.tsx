"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/utils";

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
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-black dark:border-gray-700">
        {/* 검색 입력 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-gray-400"
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
              placeholder="블로그 포스트 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() && !isLoading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}

          {results.map((post, index) => (
            <div
              key={post.slug}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                selectedIndex === index
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
              onClick={() => handlePostClick(post.slug)}
            >
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {highlightText(post.metadata.title, query)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {highlightText(post.metadata.description, query)}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.metadata.publishedAt}</span>
                  <span>•</span>
                  <span>{post.metadata.timeToRead}분 읽기</span>
                  {post.metadata.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex space-x-1">
                        {post.metadata.tags.slice(0, 3).map((tag, idx) => (
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
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <div>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                ↑↓
              </kbd>{" "}
              탐색,{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                Enter
              </kbd>{" "}
              선택,{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                Esc
              </kbd>{" "}
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
