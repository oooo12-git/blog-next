import { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

import { getAllTags, getPostsByTag, getTagCounts } from "@/lib/utils";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Tags from "@/app/components/Tags";
import { getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { locale, slug: tagSlug } = await params;
  const t = await getTranslations("tag");
  // URL 디코딩 (한글 태그 처리)
  const decodedTag = decodeURIComponent(tagSlug);

  console.log(
    "TagPage - locale:",
    locale,
    "tagSlug:",
    tagSlug,
    "decodedTag:",
    decodedTag
  );

  try {
    // 해당 태그의 포스트들과 태그 개수 정보 가져오기
    const [{ posts }, tagCounts] = await Promise.all([
      getPostsByTag(locale, decodedTag),
      getTagCounts(locale),
    ]);

    const tagCount = tagCounts[decodedTag] || 0;

    console.log("TagPage - posts found:", posts.length, "tagCount:", tagCount);

    return (
      <div className={`${inter.className} container mx-auto px-4 py-8`}>
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold dark:text-neutral-200">
              {t("title")}: {decodedTag}
            </h1>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm dark:bg-gray-800 dark:text-neutral-200">
              {tagCount} {t("tagPostsNumber")}
            </span>
          </div>

          {/* 브레드크럼
          <nav className="text-sm text-[#706E6E]">
            <Link href={`/${locale}/blog`} className="hover:underline">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span>태그: {decodedTag}</span>
          </nav> */}
        </div>

        {/* 포스트 목록 */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-[0.5px] border-black bg-white rounded-md p-6 hover:bg-[#DDDCDC] transition-colors duration-200 dark:bg-black dark:border-neutral-200 dark:hover:bg-gray-900"
              >
                <Link href={`/${locale}/blog/${post.slug}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 hover:text-gray-600 transition-colors truncate dark:hover:text-gray-300 dark:text-neutral-200">
                    {post.metadata.title}
                  </h2>

                  <p className="text-[#706E6E] mb-4 line-clamp-2 dark:text-neutral-200">
                    {post.metadata.description}
                  </p>

                  <div className="flex flex-col sm:justify-between gap-2 sm:gap-4 text-sm text-[#706E6E] dark:text-neutral-200">
                    <div className="flex flex-col">
                      <span>
                        {t("timeToRead1")}
                        {post.metadata.timeToRead}
                        {t("timeToRead2")}
                      </span>
                      <span>
                        {t("publishedAt")}: {post.metadata.publishedAt}
                      </span>
                    </div>

                    {/* 태그들 */}
                    <div className="flex justify-start sm:justify-end">
                      <Tags tags={post.metadata.tags} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#706E6E] text-lg mb-4 dark:text-neutral-200">
              &lsquo;{decodedTag}&rsquo; 태그를 가진 포스트가 없습니다.
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors dark:bg-gray-800 dark:text-neutral-200 dark:hover:bg-gray-900"
            >
              모든 포스트 보기
            </Link>
          </div>
        )}

        {/* 페이지네이션 (필요시 추가) */}
        {/* {totalPages > 1 && (
          <div className="mt-12 text-center">
            <p className="text-[#706E6E]">총 {totalPages}페이지 중 1페이지</p>
          </div>
        )} */}

        {/* 태그 관련 통계 */}
        <div className="mt-12 p-4 border-[0.5px] border-black bg-[#ECEAEA] rounded-md dark:bg-black dark:border-neutral-400">
          <h3 className="text-lg font-medium mb-2 text-[#706E6E] dark:text-neutral-200">
            {t("tagInfo")}
          </h3>
          <p className="text-[#706E6E] dark:text-neutral-200">
            <strong>&lsquo;{decodedTag}&rsquo;</strong> {t("tagCount1")}
            <strong>{tagCount}</strong> {t("tagCount2")}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in TagPage:", error);
    return (
      <div className="text-center py-12">
        <p className="text-[#706E6E] text-lg mb-4">
          &lsquo;{decodedTag}&rsquo; 태그를 가진 포스트를 로드하는 중 오류가
          발생했습니다.
        </p>
        <Link
          href={`/${locale}/blog`}
          className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          모든 포스트 보기
        </Link>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug: tagSlug } = await params;
  const decodedTag = decodeURIComponent(tagSlug);

  const { posts } = await getPostsByTag(locale, decodedTag);
  const postCount = posts.length;

  const pathname = getPathname({ locale, href: `/blog/tag/${tagSlug}` });

  return {
    title: `${decodedTag} 태그 - Dev Jaehyun's Blog`,
    description: `${decodedTag} 태그가 포함된 ${postCount}개의 포스트를 확인해보세요.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    },
    openGraph: {
      type: "website",
      title: `${decodedTag} 태그 - Dev Jaehyun's Blog`,
      description: `${decodedTag} 태그가 포함된 ${postCount}개의 포스트를 확인해보세요.`,
      siteName: "Dev Jaehyun's Blog 개발자 김재현의 블로그",
      locale,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/blog/tag/${tagSlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTag} 태그 - Dev Jaehyun's Blog`,
      description: `${decodedTag} 태그가 포함된 ${postCount}개의 포스트를 확인해보세요.`,
    },
  };
}

export async function generateStaticParams() {
  // 모든 로케일과 태그 조합을 생성
  const paths = [];

  try {
    for (const locale of routing.locales) {
      try {
        const allTags = await getAllTags(locale);

        for (const tag of allTags) {
          paths.push({
            locale,
            slug: encodeURIComponent(tag), // 한글 태그를 위한 URL 인코딩
          });
        }
      } catch (error) {
        console.error(
          `Error generating static params for locale ${locale}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
  }

  console.log("Generated static params for tag pages:", paths);
  return paths;
}

export const dynamicParams = true;
