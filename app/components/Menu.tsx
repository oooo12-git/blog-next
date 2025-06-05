"use client";

import { Link } from "../../i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Menu({ interClass }: { interClass: string }) {
  const t = useTranslations("menu");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트(최초 렌더링)될 때 한 번만 실행되는 훅
    // 로컬 스토리지에서 저장된 테마 확인
    // 로컬 스토리지(localStorage)는 웹 브라우저에서 제공하는 클라이언트 측 저장소입니다. 다음과 같은 특징이 있습니다: 브라우저에 키-값 쌍을 저장할 수 있는 간단한 저장소입니다.
    const savedTheme = localStorage.getItem("theme"); // 로컬 스토리지에서 'theme' 키로 저장된 값을 가져옴
    const prefersDark = window.matchMedia(
      // 사용자 시스템이 다크 모드를 선호하는지 확인
      "(prefers-color-scheme: dark)" // CSS 미디어 쿼리로 시스템의 색상 테마 설정 확인
    ).matches; // 일치하면 true 반환

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      // 다크 모드 적용 조건 검사
      // 1. 저장된 테마가 'dark'인 경우 또는
      // 2. 저장된 테마가 없고 시스템이 다크 모드를 선호하는 경우
      document.documentElement.classList.add("dark"); // HTML 루트 요소에 'dark' 클래스 추가
      setIsDarkMode(true);
    } else {
      // 라이트 모드 적용 조건
      document.documentElement.classList.remove("dark"); // HTML 루트 요소에서 'dark' 클래스 제거
    }
  }, []); // 빈 배열은 이 효과가 컴포넌트 마운트(최초 렌더링) 시에만 실행되고 업데이트 시에는 실행되지 않음을 의미

  const toggleDarkMode = () => {
    console.log("Toggling dark mode. Current state:", isDarkMode);

    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    console.log("Dark mode toggled to:", newDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex items-center">
      {/* 데스크탑 메뉴 */}
      <div className="hidden sm:flex sm:items-center">
        <div className={`font-normal ${interClass}`}>
          <ul className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <Link
                href="/about"
                className="px-3 py-2 rounded-md dark:hover:text-gray-400"
              >
                {t("items.about")}
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="px-3 py-2 rounded-md dark:hover:text-gray-400"
              >
                {t("items.blog")}
              </Link>
            </li>
            <li>
              <Link
                href="/stat"
                className="px-3 py-2 rounded-md dark:hover:text-gray-400"
              >
                {t("items.stat")}
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/oooo12-git"
                className="text-sm flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="rounded-md px-3 py-2 w-13 h-11 text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-2 rounded-md  hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                aria-label="다크모드 토글"
              >
                {isDarkMode ? (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 모바일 메뉴 버튼 */}
      <div className="sm:hidden flex items-center space-x-2">
        {/* GitHub 아이콘 (모바일) */}
        <Link
          href="https://github.com/oooo12-git"
          className="p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        {/* 다크모드 토글 버튼 (모바일) */}
        <button
          onClick={toggleDarkMode}
          className="p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="다크모드 토글"
        >
          {isDarkMode ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* 햄버거 메뉴 버튼 */}
        <button
          onClick={toggleMobileMenu}
          className="p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="메뉴 토글"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 w-48 sm:hidden z-50">
          <div className={`${interClass}`}>
            <Link
              href="/about"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("items.about")}
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("items.blog")}
            </Link>
            <Link
              href="/stat"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("items.stat")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
