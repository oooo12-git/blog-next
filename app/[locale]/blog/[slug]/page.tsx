import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import Image from "next/image";
import { Inter } from "next/font/google";
import { LikeButtonSupabase } from "@/app/components/LikeButtonSupabase";

const inter = Inter({ subsets: ["latin"] });

import { getTranslations } from "next-intl/server";

import { getPost, getPosts, getPostSlugs, getPostViewCount } from "@/lib/utils";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Tags from "@/app/components/Tags";
import ViewCounter from "@/app/components/ViewCounter";
import RelatedTagPosts from "@/app/components/RelatedTagPosts";
import NotRelatedPosts from "@/app/components/NotRelatedPosts";
import CommentSection from "@/app/components/CommentSection";

import { Post } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const generateJsonLd = (post: Post, locale: string, slug: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.kimjaahyun.com";
  const isReview = post.metadata.tags?.some((tag: string) =>
    ["맛집", "Restaurant"].includes(tag)
  );

  const baseSchema = {
    "@context": "https://schema.org",
    author: {
      "@type": "Person",
      name: "김재현",
      url: `${baseUrl}/${locale}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Jaehyun's Blog",
    },
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.lastModifiedAt || post.metadata.publishedAt,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
  };

  if (isReview && post.metadata.itemReviewed && post.metadata.reviewRating) {
    return {
      ...baseSchema,
      "@type": "Review",
      name: post.metadata.title,
      itemReviewed: post.metadata.itemReviewed,
      reviewRating: post.metadata.reviewRating,
      url: `${baseUrl}/${locale}/blog/${slug}`,
    };
  }

  return {
    ...baseSchema,
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image: post.metadata.heroImage
      ? `${baseUrl}/_next/image?url=${encodeURIComponent(
          post.metadata.heroImage
        )}&w=3840&q=75`
      : `${baseUrl}/default-blog-image.png`,
    url: `${baseUrl}/${locale}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`,
    },
    keywords: post.metadata.tags?.join(", "),
    articleSection: "Technology",
    timeRequired: `PT${post.metadata.timeToRead}M`,
  };
};
// TypeScript의 interface는 객체의 구조를 정의하는 타입 시스템입니다. 객체가 어떤 속성들을 가져야 하는지, 그 속성들의 타입은 무엇인지를 명시

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  const { metadata } = await getPost(slug, locale);
  const currentViewCount = await getPostViewCount(slug);

  const { default: Post } = await import(`@/contents/${slug}/${locale}.mdx`); // default: Post는 객체 구조 분해 할당(destructuring assignment) 문법. 아래 두 코드를 한 줄로 축약한 것.
  // // const mod = await import(`@/contents/${slug}.mdx`)
  // // const Post = mod.default
  const t = await getTranslations("content");

  // 모든 글을 가져와서 동일한 태그를 가진 글들을 필터링
  const { posts } = await getPosts(locale);

  const post: Post = { slug, metadata };
  const jsonLd = generateJsonLd(post, locale, slug);

  return (
    <div className={`${inter.className}`}>
      <article className="mt-4 px-2 sm:px-0">
        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* 타이틀, 태그 */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {metadata.title}
          </h1>
          <Tags tags={metadata.tags} />
        </div>
        {/* 읽는데 걸리는 시간, 마지막 수정일, 처음 쓰여진 날, 이 글을 보러온 횟수 */}
        <div className="mt-3 sm:mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-[#706E6E] font-light dark:text-white">
          <div>
            {t("timeToRead1")}
            {metadata.timeToRead}
            {t("timeToRead2")}
          </div>
          <div>
            {t("publishedAt")}: {metadata.publishedAt}
          </div>
          <div>
            {t("lastModifiedAt")}: {metadata.lastModifiedAt}
          </div>
          <ViewCounter
            slug={slug}
            locale={locale}
            initialCount={currentViewCount}
            viewCountLabel={t("viewCount")}
          />
        </div>

        {/* <header> 태그를 사용한 이유:
시맨틱적으로 문서나 섹션의 소개나 요약 내용을 나타내는 데 가장 적합합니다. */}
        <header className="mt-4 mb-4 text-[#706E6E] px-1 sm:px-0 dark:text-gray-400">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t("description")}
          </h2>
          <p className="font-light text-sm sm:text-base">
            {metadata.description}
          </p>
        </header>
        <div className="px-1 sm:px-0">
          <Post />
        </div>
      </article>
      <LikeButtonSupabase slug={slug} locale={locale} size="lg" />

      {/* 댓글 섹션 */}
      <CommentSection slug={slug} locale={locale} />

      {/* 관련 글 컴포넌트 */}
      <RelatedTagPosts tags={metadata.tags} posts={posts} currentSlug={slug} />
      <NotRelatedPosts tags={metadata.tags} posts={posts} currentSlug={slug} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { metadata } = await getPost(slug, locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.kimjaahyun.com";

  const ogImage = metadata.heroImage
    ? {
        url: `${baseUrl}/${metadata.heroImage}`,
      }
    : null;

  const pathname = getPathname({ locale, href: `/blog/${slug}` });

  return {
    title: `${metadata.title} | 재현기획개발`,
    description: metadata.description,
    alternates: {
      canonical: `${baseUrl}${pathname}`,
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      siteName: "재현기획개발 JaeHyun Dev & Plan",
      locale,
      publishedTime: metadata.publishedAt,
      modifiedTime: metadata.lastModifiedAt || metadata.publishedAt,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export function generateStaticParams() {
  const slugs = getPostSlugs();
  const paths = slugs.flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, slug }))
  );
  return paths;
}
//generateStaticParams는 제공된 라우트들을 미리 렌더링하는 데 사용될 수 있습니다. dynamicParams를 false로 설정함으로써, generateStaticParams에 정의되지 않은 라우트에 접근하면 404 에러가 발생하게 됩니다. https://nextjs.org/docs/app/api-reference/functions/generate-static-params

export const dynamicParams = false;
//dynamicParams = false로 설정되어 있기 때문에, 정의된 페이지 외에 다른 URL로 접근하면 404 페이지를 보게 됩니다. 이는 보안과 성능 최적화를 위한 설정입니다
