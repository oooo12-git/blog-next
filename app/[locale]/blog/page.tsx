import { getAllTags, getTagCounts, getRecentTags } from "@/lib/utils";
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 최근 태그 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">최근 태그</h2>
        <div className="flex flex-wrap gap-3">
          {recentTags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
              className="border-[0.5px] border-black bg-white px-3 py-2 rounded-md text-sm text-black hover:bg-[#DDDCDC] transition-colors duration-200"
            >
              <span className="mr-2">{tag}</span>
              <span className="bg-white bg-opacity-10 px-2 py-0.5 rounded-full text-xs border-[0.5px] border-black">
                {tagCounts[tag]}
              </span>
            </Link>
          ))}
        </div>

        {recentTags.length === 0 && (
          <p className="text-gray-500 italic">아직 최근 태그가 없습니다.</p>
        )}
      </section>

      {/* 모든 태그 섹션 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">모든 태그</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
              className="border-[0.5px] border-black bg-white rounded-md p-4 hover:bg-[#DDDCDC] transition-colors duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-[#706E6E] truncate w-[90px]">
                  {tag}
                </span>
                <span className="bg-white bg-opacity-10 text-[#706E6E] text-sm font-medium px-2.5 py-0.5 rounded-full border-[0.5px] border-black">
                  {tagCounts[tag]}개 포스트
                </span>
              </div>
            </Link>
          ))}
        </div>

        {allTags.length === 0 && (
          <p className="text-gray-500 italic">아직 태그가 없습니다.</p>
        )}

        <div className="mt-8 p-4 border-[0.5px] border-black bg-[#ECEAEA] rounded-md">
          <h3 className="text-lg font-medium mb-2 text-[#706E6E]">태그 통계</h3>
          <p className="text-[#706E6E]">
            총 <strong>{allTags.length}개</strong>의 고유한 태그가 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
