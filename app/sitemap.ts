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
  const redirectedSlugs: string[] = [];

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
