"use client";

import { isValidElement, useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // code 태그에서 언어 정보 추출
  let language = "text";
  let codeText = "";

  if (
    isValidElement(children) &&
    children.props &&
    typeof children.props === "object" &&
    "className" in children.props &&
    typeof children.props.className === "string"
  ) {
    const className = children.props.className as string;
    language = className.replace("language-", "") || "text";

    // 코드 텍스트 추출 - 더 안전한 방식
    const codeProps = children.props as Record<string, unknown>;
    if (typeof codeProps.children === "string") {
      codeText = codeProps.children;
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="border border-gray-300 bg-neutral-50 rounded-lg my-4 overflow-hidden dark:bg-gray-900 dark:border-gray-600">
      {/* 언어 라벨 및 복사 버튼 */}
      <div className="bg-[#ECEAEA] px-3 py-1 text-sm text-[#706E6E] border-b border-gray-300 dark:bg-gray-800 dark:text-neutral-200 dark:border-gray-600 flex justify-between items-center">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="ml-2 px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          title="코드 복사"
        >
          {copied ? "복사됨!" : "복사"}
        </button>
      </div>
      {/* 코드 영역 */}
      <pre className="p-4 overflow-x-auto text-sm" {...props}>
        {children}
      </pre>
    </div>
  );
}
