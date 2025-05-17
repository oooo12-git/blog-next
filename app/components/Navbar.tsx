"use client";

import Link from "next/link";
import { useState } from "react";
import { RocknRoll_One } from "next/font/google";
import { Inter } from "next/font/google";

const rocknRollOne = RocknRoll_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["500", "300"],
  subsets: ["latin"],
  display: "swap",
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <nav className="bg-white dark:bg-black h-16 flex justify-between transition-colors duration-200">
      <div className="flex items-center">
        <Link href="/" className="flex-shrink-0 flex items-center">
          <header className="flex flex-col items-center">
            <h1
              className={`text-2xl ${rocknRollOne.className} text-gray-900 dark:text-white`}
            >
              金宰賢
            </h1>
            <h2
              className={`text-xs text-gray-700 dark:text-gray-300 ${inter.className}`}
            >
              KIM JAE HYUN
            </h2>
          </header>
        </Link>
      </div>

      <div className="flex items-center w-[160px]">
        <form className="flex items-center justify-center rounded-[10px] bg-[#ECEAEA] dark:bg-gray-800 border border-black border-opacity-50 h-[23px] w-full">
          <button type="submit" className="h-full flex items-center px-1">
            <svg
              className="w-3 h-3 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <input
            type="search"
            placeholder="Search"
            className={`h-full w-auto bg-transparent focus:outline-none text-xs text-center font-light dark:text-gray-300 ${inter.className}`}
          />
        </form>
      </div>

      {/* Desktop menu */}
      <div className="flex items-center">
        <div className="hidden sm:flex sm:items-center">
          <div className={`font-light ${inter.className}`}>
            <ul className="flex items-center space-x-1">
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/learning"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Learning
                </Link>
              </li>
              <li>
                <Link
                  href="/opinion"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Opinion
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/oooo12-git"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-7 h-7"
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
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
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
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
        >
          <span className="sr-only">메뉴 열기</span>
          {!isMenuOpen ? (
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <nav className={`pt-2 pb-3 space-y-1 ${inter.className}`}>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  소개
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </nav>
  );
}
