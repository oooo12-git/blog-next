import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/app/components/CodeBlock";
import MermaidDiagram from "@/app/components/MermaidDiagram";
import { isValidElement } from "react";
import Link from "next/link";

// React 요소에서 텍스트를 추출하는 함수
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (
    isValidElement(node) &&
    node.props &&
    typeof node.props === "object" &&
    node.props !== null &&
    "children" in node.props
  ) {
    return extractText(node.props.children as React.ReactNode);
  }
  return "";
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-6 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-8 mb-6 text-gray-700 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-8 mb-6 text-gray-700 dark:text-white">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mb-6 text-gray-500 dark:text-white leading-loose">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border border-gray-400 bg-neutral-100 px-4 pt-4 my-4 rounded-r-md text-black leading-loose dark:bg-gray-800 dark:border-gray-600 dark:text-neutral-200 rounded-lg">
        {children}
      </blockquote>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 pl-4 space-y-2 [&>li>p:first-child]:inline [&>li>p:first-child]:mr-2">
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 pl-4 space-y-2 [&>li>p:first-child]:inline [&>li>p:first-child]:mr-2">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="mb-1 dark:text-white leading-loose">{children}</li>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white dark:bg-gray-900">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600 last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 last:border-r-0">
        {children}
      </td>
    ),
    pre: ({ children, ...props }) => {
      // mermaid 코드 블록 감지
      const child = children as any;
      if (child?.props?.className?.includes("language-mermaid")) {
        // React 요소에서 텍스트 추출
        const code = extractText(child.props.children);
        return <MermaidDiagram chart={code} />;
      }

      // 언어 정보를 children의 code 요소에서 추출하여 props에 추가
      let language = "text";
      if (child?.props?.className) {
        const langMatch = child.props.className.match(/language-(\w+)/);
        if (langMatch) {
          language = langMatch[1];
        }
      }

      return (
        <CodeBlock {...props} data-language={language}>
          {children}
        </CodeBlock>
      );
    },
    code: ({ children, className, ...props }) => {
      // 인라인 코드와 블록 코드 구분
      if (className?.startsWith("language-")) {
        // mermaid 처리는 pre에서 하므로 기본 코드 블록 처리
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      // 인라인 코드 스타일
      return (
        <code
          className="bg-gray-100 px-1 py-0.5 rounded text-sm dark:bg-[#24292e] dark:text-white"
          {...props}
        >
          {children}
        </code>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => {
      if (href && (href.startsWith("/") || href.startsWith("#"))) {
        return (
          <Link href={href} className="text-blue-600 hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
    hr: () => (
      <hr className="my-8 border-0 h-px bg-gray-300 dark:bg-gray-600" />
    ),
  };
}
// Create an mdx-components.tsx (or .js) file in the root of your project to define global MDX Components. https://nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file

// 마크다운 스타일 설정은 다음 링크 참고 : https://nextjs.org/docs/app/guides/mdx#using-custom-styles-and-components
