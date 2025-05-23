import Link from "next/link";
import { getBlogPosts, formatDate } from "@/app/blog/utils";

export function BlogPosts() {
  const allBlogs = getBlogPosts();

  return (
    <div className="border-b-1 pb-2">
      <div className="flex font-light mb-2 text-sm justify-between">
        <div className="flex items-center justify-center w-[100px] border-b-1 h-8">
          Date
        </div>
        <div className="flex items-center justify-center w-[550px] border-b-1 h-8">
          Title
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt) // Date가 클수록 최신
            ) {
              return -1; // -1을 반환하면 a가 b보다 앞에 위치
            }
            return 1; // 1을 반환하면 b가 a보다 앞에 위치
          })
          .slice(0, 3) // 앞에서 3개의 포스트만 선택 slice(0, 3)으로 정렬된 배열에서:
          // 0: 첫 번째 요소부터 시작
          // 3: 3번째 요소 직전까지 선택 (즉, 0, 1, 2 인덱스의 요소만 선택)
          .map((post) => (
            <Link
              key={post.slug} // React에서 key prop이 필요한 이유 : key를 통해 React는 어떤 항목이 변경, 추가 또는 제거되었는지 빠르게 식별할 수 있습니다. key가 없으면 React는 모든 항목을 다시 렌더링해야 할 수 있어 성능이 저하됩니다.
              className="flex flex-col"
              // space-y-1은 요소 사이에 1px의 간격을 줍니다.
              // mb-4는 요소 아래에 4px의 간격을 줍니다.
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 items-center justify-between">
                {/* tabular-nums :  모든 숫자가 동일한 너비를 가지도록 합니다.  */}
                <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums font-thin text-xs text-center">
                  {formatDate(post.metadata.publishedAt)}
                </p>
                {/* truncate: 제목이 컨테이너의 너비를 초과할 경우 자동으로 말줄임표(...) 표시 */}
                <p className="w-[550px] text-neutral-900 dark:text-neutral-100 tracking-tight truncate font-extralight text-sm">
                  {post.metadata.title}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
