import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { getTranslations } from "next-intl/server";

import { getPost, getPosts, getPostSlugs, getPostViewCount } from "@/lib/utils";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Tags from "@/app/components/Tags";
import ViewCounter from "@/app/components/ViewCounter";
import RelatedTagPosts from "@/app/components/RelatedTagPosts";
import NotRelatedPosts from "@/app/components/NotRelatedPosts";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}
// TypeScript의 interface는 객체의 구조를 정의하는 타입 시스템입니다. 객체가 어떤 속성들을 가져야 하는지, 그 속성들의 타입은 무엇인지를 명시

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;

  const { metadata } = await getPost(slug, locale);
  const currentViewCount = await getPostViewCount(slug);

  const { default: Post } = await import(`@/contents/${slug}/${locale}.mdx`); // default: Post는 객체 구조 분해 할당(destructuring assignment) 문법. 아래 두 코드를 한 줄로 축약한 것.
  // // const mod = await import(`@/contents/${slug}.mdx`)
  // // const Post = mod.default
  const t = await getTranslations("blog");

  // 모든 글을 가져와서 동일한 태그를 가진 글들을 필터링
  const { posts } = await getPosts(locale);

  return (
    <div className={`${inter.className}`}>
      <article className="mt-4">
        {/* 타이틀, 태그 */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <Tags tags={metadata.tags} />
        </div>
        {/* 읽는데 걸리는 시간, 마지막 수정일, 처음 쓰여진 날, 이 글을 보러온 횟수 */}
        <div className="mt-2 flex items-center justify-between text-sm text-[#706E6E] font-light">
          <div>
            {t("timeToRead1")}
            {metadata.timeToRead}
            {t("timeToRead2")}
          </div>
          <div>
            {t("lastModifiedAt")}: {metadata.lastModifiedAt}
          </div>
          <div>
            {t("publishedAt")}: {metadata.publishedAt}
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
        <header className="mt-4 mb-4 text-[#706E6E]">
          <h2 className="text-xl font-semibold">{t("description")}</h2>
          <p className="font-light">{metadata.description}</p>
        </header>
        <Post />
      </article>

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

  const ogImage = metadata.heroImage
    ? {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${metadata.heroImage}`,
      }
    : null;

  const pathname = getPathname({ locale, href: `/blog/${slug}` });

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      siteName: "Dev Jaehyun's Blog 개발자 김재현의 블로그 ",
      locale,
      publishedTime: metadata.publishedAt,
      modifiedTime: metadata.lastModifiedAt || metadata.publishedAt,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/${slug}`,
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
//dynamicParams = false로 설정되어 있기 때문에, 정의된 페이지 외에 다른 URL로 접근하면 404 페이지를 보게 됩니다. 이는 보안과 성능 최적화를 위한 설정입니다.
