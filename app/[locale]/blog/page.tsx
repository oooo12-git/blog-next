import { getAllTags, getTagCounts, getRecentTags } from "@/lib/utils";
import { PopularPosts } from "@/app/components/Posts";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

interface BlogPageProps {
  params: {
    locale: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // 모든 태그, 태그별 포스트 개수, 최근 태그 가져오기
  const [allTags, tagCounts, recentTags] = await Promise.all([
    getAllTags(locale),
    getTagCounts(locale),
    getRecentTags(locale, 6),
  ]);

  const t = await getTranslations("blog");

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* 최근 태그 섹션 */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          {t("recentTags")}
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {recentTags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
              className="border-[0.5px] border-black bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-black hover:bg-[#DDDCDC] transition-colors duration-200"
            >
              <span className="mr-1 sm:mr-2">{tag}</span>
              <span className="bg-white bg-opacity-10 px-1.5 sm:px-2 py-0.5 rounded-full text-xs border-[0.5px] border-black">
                {tagCounts[tag]}
              </span>
            </Link>
          ))}
        </div>

        {recentTags.length === 0 && (
          <p className="text-gray-500 italic text-sm">
            아직 최근 태그가 없습니다.
          </p>
        )}
      </section>

      {/* 인기글 섹션 */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          {t("popularPosts")}
        </h2>
        <PopularPosts params={Promise.resolve({ locale })} />
      </section>

      {/* 모든 태그 섹션 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          {t("allTags")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
              className="border-[0.5px] border-black bg-white rounded-md p-3 sm:p-4 hover:bg-[#DDDCDC] transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-medium text-[#706E6E] truncate w-[80px] sm:w-[90px]">
                  {tag}
                </span>
                <span className="bg-white bg-opacity-10 text-[#706E6E] text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded-full border-[0.5px] border-black">
                  {tagCounts[tag]} {t("posts")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {allTags.length === 0 && (
          <p className="text-gray-500 italic text-sm">아직 태그가 없습니다.</p>
        )}

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 border-[0.5px] border-black bg-[#ECEAEA] rounded-md">
          <h3 className="text-base sm:text-lg font-medium mb-2 text-[#706E6E]">
            {t("tagStats")}
          </h3>
          <p className="text-sm sm:text-base text-[#706E6E]">
            {t("totalTags1")} <strong>{allTags.length}</strong>
            {t("totalTags2")}
          </p>
        </div>
      </section>
    </div>
  );
}
