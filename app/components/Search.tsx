"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import SearchModal from "./SearchModal";

type SearchProps = {
  interClass: string;
};

export default function Search({ interClass }: SearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("menu");
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // 키보드 단축키 (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex items-center w-[120px] sm:w-[160px]">
        <div
          className="flex items-center justify-center rounded-[10px] bg-[#ECEAEA] gradient-hongkong-night border border-black border-opacity-50 h-[20px] sm:h-[23px] w-full cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={handleClick}
        >
          <button
            type="button"
            className="h-full flex items-center px-1"
            aria-label="search"
          >
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
          <div
            className={`h-full w-auto bg-transparent text-xs text-center font-light dark:text-gray-300 flex items-center justify-center flex-1 ${interClass}`}
          >
            {t("search.placeholder")}
          </div>
          <div className="text-xs text-gray-400 pr-2 hidden sm:block">⌘K</div>
        </div>
      </div>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </>
  );
}
