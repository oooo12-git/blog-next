import type { MDXComponents } from "mdx/types";
import CodeBlock from "@/app/components/CodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-4 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-6 mb-4 dark:text-white">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-4 dark:text-white">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border border-gray-400 bg-neutral-100 px-4 pt-4 my-4 rounded-r-md text-black dark:bg-gray-800 dark:border-gray-600 dark:text-neutral-200 rounded-lg">
        {children}
      </blockquote>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 pl-4 space-y-2">
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 pl-4 space-y-2">{children}</ul>
    ),
    li: ({ children }) => <li className="mb-1 dark:text-white">{children}</li>,
    pre: ({ children, ...props }) => (
      <CodeBlock {...props}>{children}</CodeBlock>
    ),
    code: ({ children, className, ...props }) => {
      // 인라인 코드와 블록 코드 구분
      if (className?.startsWith("language-")) {
        // 블록 코드는 pre에서 처리하므로 기본 스타일만
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      // 인라인 코드 스타일
      return (
        <code
          className="bg-gray-100 px-1 py-0.5 rounded text-sm dark:bg-gray-800"
          {...props}
        >
          {children}
        </code>
      );
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    hr: () => (
      <hr className="my-8 border-0 h-px bg-gray-300 dark:bg-gray-600" />
    ),
  };
}
// Create an mdx-components.tsx (or .js) file in the root of your project to define global MDX Components. https://nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file

// 마크다운 스타일 설정은 다음 링크 참고 : https://nextjs.org/docs/app/guides/mdx#using-custom-styles-and-components
