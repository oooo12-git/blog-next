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

  return (
    <nav className="bg-white h-16 flex justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex-shrink-0 flex items-center">
          <header className="flex flex-col items-center">
            <h1 className={`text-2xl ${rocknRollOne.className}`}>金宰賢</h1>
            <h2 className={`text-xs text-black ${inter.className}`}>
              KIM JAE HYUN
            </h2>
          </header>
        </Link>
      </div>

      <div className="flex items-center w-[160px]">
        <form className="flex items-center justify-center rounded-[10px] bg-[#ECEAEA] border border-black border-opacity-50 h-[23px] w-full">
          <button type="submit" className="h-full flex items-center px-1">
            <svg
              className="w-3 h-3 text-gray-500"
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
            className={`h-full w-auto bg-transparent focus:outline-none text-xs text-center font-light ${inter.className}`}
          />
        </form>
      </div>

      {/* Desktop menu */}
      <div className="flex items-center">
        <div className="hidden sm:flex sm:items-center">
          <div className={`ml-10 font-light ${inter.className}`}>
            <ul className="flex items-center space-x-3">
              <li>
                <Link
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/learning"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Learning
                </Link>
              </li>
              <li>
                <Link
                  href="/opinion"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Opinion
                </Link>
              </li>
              <li>
                <Link
                  href="/opinion"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Git
                </Link>
              </li>
              <li>
                <Link
                  href="/opinion"
                  className="px-3 py-2 rounded-md text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Dark
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50"
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
