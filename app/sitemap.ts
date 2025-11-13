import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 정적 페이지들
  const staticPages = [
    {
      url: "https://www.kimjaahyun.com",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://www.kimjaahyun.com/en",
        },
      },
    },
    {
      url: "https://www.kimjaahyun.com/ko/about",
      lastModified: new Date("2025-06-13"),
      alternates: {
        languages: {
          en: "https://www.kimjaahyun.com/en/about",
        },
      },
    },
    {
      url: "https://www.kimjaahyun.com/ko/blog",
      lastModified: new Date(),
      alternates: {
        languages: {
          en: "https://www.kimjaahyun.com/en/blog",
        },
      },
    },
    {
      url: "https://mailecho.kimjaahyun.com",
      lastModified: new Date("2025-07-02"),
    },
  ];

  // 리다이렉트하는 slug들을 제외
  const redirectedSlugs = [
    'gof-design-pattern-cheat-sheet',
    'page-replacement-for-exam',
    'subnet-mask-for-exam',
    'uml-diagram-4-1-view',
    'routing-protocol',
    'test-coverage-for-exam',
    'sql-for-exam',
    'database-file-structure',
    'relational-data-model-elements',
    'web-service-interface',
    'interface-data-formats',
    'ipsec',
    'interface-communication-technologies',
    'test-auto-tool-for-exam',
    'blackbox-test-for-exam',
    'network-protocol-for-exam',
    'data-link-protocol-for-exam',
    'network-tranmission-method',
    'data-integrity-for-exam',
    'db-key-for-exam',
    'db-normalization-for-exam',
    'relational-algebra-for-exam',
    'transaction-for-exam',
    'process-scheduling-for-exam',
    'aaa-authentication-authorization-accounting',
    'authentication-technologies',
    'cloud-new-tech-for-exam',
    'cryptography-algorithms-for-exam',
    'db-new-tech-for-exam',
    'dos-attack',
    'network-attack',
    'network-new-tech-for-exam',
    'server-access-control',
    'sw-new-tech-for-exam',
    'gof-design-behavioral-pattern-3',
    'gof-design-behavioral-pattern-2',
    'gof-design-behavioral-pattern-5',
    'gof-design-behavioral-pattern-4',
    'gof-design-behavioral-pattern-1',
    'gof-design-creational-pattern-for-exam',
    'gof-design-structural-pattern-for-exam',
    'gof-design-structural-pattern-2',
    'module-cohesion-coupling',
    'interface-security-for-exam',
    'jeongcheogi-pass-rate',
    'uml-class-diagram-relationships',
  ];

  // 블로그 포스트들을 가져와서 sitemap에 추가
  const koPostsData = await getPosts("ko");
  const enPostsData = await getPosts("en");

  const blogPosts: MetadataRoute.Sitemap = [];

  // 한국어 포스트들 처리 (리다이렉트하는 slug 제외)
  for (const post of koPostsData.posts) {
    if (!redirectedSlugs.includes(post.slug)) {
      blogPosts.push({
        url: `https://www.kimjaahyun.com/ko/blog/${post.slug}`,
        lastModified: new Date(post.metadata.lastModifiedAt),
        alternates: {
          languages: {
            en: `https://www.kimjaahyun.com/en/blog/${post.slug}`,
          },
        },
      });
    }
  }

  // 영어 포스트들 처리 (리다이렉트하는 slug 제외)
  for (const post of enPostsData.posts) {
    if (!redirectedSlugs.includes(post.slug)) {
      blogPosts.push({
        url: `https://www.kimjaahyun.com/en/blog/${post.slug}`,
        lastModified: new Date(post.metadata.lastModifiedAt),
        alternates: {
          languages: {
            ko: `https://www.kimjaahyun.com/ko/blog/${post.slug}`,
          },
        },
      });
    }
  }

  return [...staticPages, ...blogPosts];
}
