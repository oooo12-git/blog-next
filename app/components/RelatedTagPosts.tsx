import { Link } from "@/i18n/navigation";

interface Post {
  slug: string;
  metadata: {
    title: string;
    description: string;
    tags: string[];
    publishedAt: string;
  };
}

interface RelatedTagPostsProps {
  tags: string[];
  posts: Post[];
  currentSlug: string;
}

export default function RelatedTagPosts({
  tags,
  posts,
  currentSlug,
}: RelatedTagPostsProps) {
  // 각 태그별로 관련글을 필터링하는 함수
  const getPostsByTag = (tag: string) => {
    return posts
      .filter((post) => {
        // 현재 글 제외
        if (post.slug === currentSlug) return false;
        // 해당 태그를 가진 글들만 필터링
        return post.metadata.tags.includes(tag);
      })
      .slice(0, 5); // 최대 5개만 표시
  };

  return (
    <>
      {/* 각 태그별 관련 글 섹션 */}
      {tags.map((tag) => {
        const tagPosts = getPostsByTag(tag);

        // 해당 태그의 관련글이 없으면 섹션을 보여주지 않음
        if (tagPosts.length === 0) return null;

        return (
          <div key={tag} className="mt-8 mx-2 sm:mx-0">
            <div className="flex flex-col rounded-md border-[0.5px] p-3 sm:p-4 dark:border-neutral-400">
              <div className="flex items-center gap-2 mb-4">
                <span className="border-[0.5px] bg-[#ECEAEA] px-2 py-1 rounded-md text-xs sm:text-sm text-[#706E6E] dark:bg-gray-800 dark:border-0 dark:text-neutral-200">
                  {tag}
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-[#333] dark:text-neutral-200">
                  최신 글
                </h3>
              </div>

              <div className="flex flex-col space-y-1">
                {tagPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex flex-col"
                  >
                    <div className="w-full flex flex-row space-x-2 items-center justify-between">
                      <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums font-thin text-xs text-center dark:hover:text-gray-200">
                        {post.metadata.publishedAt}
                      </p>
                      <p className="w-[250px] sm:w-[550px] text-neutral-900 dark:text-neutral-100 tracking-tight truncate font-extralight text-sm dark:hover:text-gray-300">
                        {post.metadata.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
