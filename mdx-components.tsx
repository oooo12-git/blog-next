import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-4">{children}</h2>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
  };
}
// Create an mdx-components.tsx (or .js) file in the root of your project to define global MDX Components. https://nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file

// 마크다운 스타일 설정은 다음 링크 참고 : https://nextjs.org/docs/app/guides/mdx#using-custom-styles-and-components
