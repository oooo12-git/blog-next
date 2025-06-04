import { Link } from "../../i18n/navigation";
import { Inter } from "next/font/google";
import { getPosts, getPopularPosts, PostWithViewCount } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export async function BlogPosts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const upperPosts = await getPosts(locale, 3);

  const t = await getTranslations("blog");

  return (
    <div className={`w-full border-b-1 pb-2 ${inter.className}`}>
      <div className="flex font-light mb-2 mx-2 sm:mx-0 text-sm justify-between">
        <div className="flex items-center justify-center w-[100px] border-b-1 h-8 ">
          {t("date")}
        </div>
        <div className="flex items-center justify-center w-[250px] sm:w-[550px] border-b-1 h-8">
          {t("title")}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        {upperPosts.posts.map((post) => (
          <Link
            key={post.slug} // React에서 key prop이 필요한 이유 : key를 통해 React는 어떤 항목이 변경, 추가 또는 제거되었는지 빠르게 식별할 수 있습니다. key가 없으면 React는 모든 항목을 다시 렌더링해야 할 수 있어 성능이 저하됩니다.
            className="flex flex-col mx-2 sm:mx-0"
            // space-y-1은 요소 사이에 1px의 간격을 줍니다.
            // mb-4는 요소 아래에 4px의 간격을 줍니다.
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-row space-x-2 items-center justify-between">
              {/* tabular-nums :  모든 숫자가 동일한 너비를 가지도록 합니다.  */}
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums font-thin text-xs text-center">
                {post.metadata.publishedAt}
              </p>
              {/* truncate: 제목이 컨테이너의 너비를 초과할 경우 자동으로 말줄임표(...) 표시 */}
              <p className="w-[250px] sm:w-[550px] text-neutral-900 dark:text-neutral-100 tracking-tight truncate font-extralight text-sm">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function PopularPosts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const popularPosts = await getPopularPosts(locale, 10);
  const t = await getTranslations("blog");

  return (
    <div className={`border-b-1 pb-2 ${inter.className}`}>
      <div className="flex font-light mb-2 mx-2 sm:mx-0 text-sm justify-between">
        <div className="flex items-center justify-center w-[100px] border-b-1 h-8">
          {t("date")}
        </div>
        <div className="flex items-center justify-center w-[200px] sm:w-[450px] border-b-1 h-8">
          {t("title")}
        </div>
        <div className="flex items-center justify-center w-[50px] sm:w-[100px] border-b-1 h-8">
          {t("views")}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        {popularPosts.posts.map((post: PostWithViewCount) => (
          <Link
            key={post.slug}
            className="flex flex-col mx-2 sm:mx-0"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-row space-x-2 items-center justify-between">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums font-thin text-xs text-center">
                {post.metadata.publishedAt}
              </p>
              <p className="w-[200px] sm:w-[450px] text-neutral-900 dark:text-neutral-100 tracking-tight truncate font-extralight text-sm">
                {post.metadata.title}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 w-[50px] sm:w-[100px] tabular-nums font-thin text-xs text-center">
                {post.viewCount.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
