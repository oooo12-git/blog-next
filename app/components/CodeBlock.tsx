"use client";

import { isValidElement, useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function CodeBlock({ children, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);


  // 언어 정보와 코드 텍스트 추출
  let language = "text";
  let codeText = "";

  // 언어 정보 추출
  // 1. props에서 data-language 확인
  if ("data-language" in props && typeof props["data-language"] === "string") {
    language = props["data-language"] as string;
  }
  
  // 2. props className에서 언어 확인 (language-xxx 패턴)
  else if ("className" in props && typeof props.className === "string") {
    const className = props.className as string;
    const langMatch = className.match(/language-(\w+)/);
    if (langMatch) {
      language = langMatch[1];
    }
  }

  // 3. children props에서 확인 (fallback)
  else if (isValidElement(children) && children.props) {
    const childProps = children.props as Record<string, unknown>;
    
    if ("data-language" in childProps && typeof childProps["data-language"] === "string") {
      language = childProps["data-language"];
    }
    else if ("className" in childProps && typeof childProps.className === "string") {
      const className = childProps.className;
      const langMatch = className.match(/language-(\w+)/);
      if (langMatch) {
        language = langMatch[1];
      }
    }
  }


  // 코드 텍스트 추출
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (isValidElement(node) && node.props && typeof node.props === "object" && node.props !== null && "children" in node.props) {
      return extractText(node.props.children as React.ReactNode);
    }
    return "";
  };

  if (isValidElement(children) && children.props && typeof children.props === "object" && children.props !== null && "children" in children.props) {
    codeText = extractText(children.props.children as React.ReactNode);
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
      <div className="p-4 overflow-x-auto text-sm">
        <pre className="!bg-transparent !p-0 !m-0" {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
}
