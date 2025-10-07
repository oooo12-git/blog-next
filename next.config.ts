import type { NextConfig } from "next";
// 중괄호 {}가 있으면: "이 모듈에서 특정 이름의 export를 가져와줘"
import createMDX from "@next/mdx";
// 중괄호가 없으면: "이 모듈의 기본(default) export를 가져와줘"
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  // Redirects 설정 추가
  async redirects() {
    return [
      {
        source: '/ko/blog/gof-design-pattern-cheat-sheet',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-design/design-pattern-cheatsheet',
        permanent: true,
      },
      {
        source: '/ko/blog/page-replacement-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/memory-page-replacement',
        permanent: true,
      },
      {
        source: '/ko/blog/subnet-mask-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/subnet-mask',
        permanent: true,
      },
      {
        source: '/ko/blog/uml-diagram-4-1-view',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-design/uml-diagram',
        permanent: true,
      },
      {
        source: '/ko/blog/routing-protocol',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/routing-protocol',
        permanent: true,
      },
      {
        source: '/ko/blog/test-coverage-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/test-coverage',
        permanent: true,
      },
      {
        source: '/ko/blog/sql-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/db/sql-problems',
        permanent: true,
      },
      {
        source: '/ko/blog/database-file-structure',
        destination: 'https://jeongcheogi.edugamja.com/theory/db/database-file-structure',
        permanent: true,
      },
      {
        source: '/ko/blog/relational-data-model-elements',
        destination: 'https://jeongcheogi.edugamja.com/theory/db/relational-data-model-elements',
        permanent: true,
      },
      {
        source: '/ko/blog/web-service-interface',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/web-service-interface',
        permanent: true,
      },
      {
        source: '/ko/blog/interface-data-formats',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/interface-data-formats',
        permanent: true,
      },
      {
        source: '/ko/blog/ipsec',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/ipsec',
        permanent: true,
      },
      {
        source: '/ko/blog/interface-communication-technologies',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/interface-communication-tech',
        permanent: true,
      },
      {
        source: '/ko/blog/test-auto-tool-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/test-auto-tool',
        permanent: true,
      },
      {
        source: '/ko/blog/blackbox-test-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/sw-dev/blackbox-test',
        permanent: true,
      },
      {
        source: '/ko/blog/network-protocol-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/network-protocol',
        permanent: true,
      },
      {
        source: '/ko/blog/data-link-protocol-for-exam',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/data-link-protocol',
        permanent: true,
      },
      {
        source: '/ko/blog/network-tranmission-method',
        destination: 'https://jeongcheogi.edugamja.com/theory/network-os/network-transmission-method',
        permanent: true,
      },
    ];
  },
  // Optionally, add any other Next.js config below
};

const withNextIntl = createNextIntlPlugin();

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [
      // @ts-expect-error
      ["remark-math", { strict: true, throwOnError: true }],
      // @ts-expect-error
      ["remark-gfm", { strict: true, throwOnError: true }],
    ],

    rehypePlugins: [
      // @ts-expect-error - 플러그인 타입 오류 무시
      ["rehype-katex", { strict: true, throwOnError: true }],
      [
        // @ts-expect-error - Shiki 플러그인 타입 오류 무시
        "@shikijs/rehype",
        {
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          // 언어 정보를 data-language 속성으로 추가
          addLanguageClass: true,
        },
      ],
    ],
  },
});
// createMDX는 함수를 반환하는 함수입니다. 이는 다음과 같은 특징으로 알 수 있습니다:
// createMDX({})와 같이 객체를 인자로 받고
// 반환된 withMDX를 withMDX(nextConfig)와 같이 함수처럼 호출
// Turbopack does not currently support the extension option and therefore does not support .md files.

// module.exports = {
//   images: {
//     remotePatterns: [new URL("https://upload.wikimedia.org/**")],
//   },
// };

// Merge MDX config with Next.js config
export default withNextIntl(withMDX(nextConfig));
// // 내부적으로 이런 식으로 동작합니다
// function withMDX(nextConfig) {
//   return {
//     ...nextConfig,           // 기존 Next.js 설정
//     ...mdxSpecificConfig,    // MDX 관련 설정
//     // 추가적인 설정 병합 로직
//   }
// }
