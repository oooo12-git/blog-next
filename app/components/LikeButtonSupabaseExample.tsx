"use client";

import { LikeButtonSupabase } from "./LikeButtonSupabase";

// Supabase 연동 좋아요 버튼 예시 컴포넌트
export function PostWithSupabaseLikes({
  slug = "example-post-supabase",
  locale = "ko",
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 포스트 제목 */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Supabase 연동 좋아요 버튼 예시
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          실제 데이터베이스와 연동되어 상태가 저장되는 좋아요 버튼입니다.
        </p>
      </header>

      {/* 포스트 내용 */}
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <p>
          이 좋아요 버튼은 Supabase 데이터베이스와 연동되어 있습니다. 클릭하면
          실제로 데이터가 저장되고, 새로고침해도 상태가 유지됩니다.
        </p>

        <p>
          또한 IP와 User-Agent를 기반으로 한 세션 시스템으로 중복 좋아요를
          방지합니다.
        </p>

        {/* 포스트 중간의 좋아요 버튼 */}
        <div className="my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              이 부분이 마음에 들었다면 좋아요를 눌러주세요!
            </p>
            <LikeButtonSupabase
              slug={slug}
              locale={locale}
              size="md"
              showCount={true}
            />
          </div>
        </div>

        <p>
          같은 포스트 ID를 가진 버튼들은 자동으로 상태가 동기화됩니다. 아래
          버튼과 위 버튼 중 하나를 클릭해보세요!
        </p>

        <h2>Supabase 연동의 장점</h2>
        <ul>
          <li>실제 데이터베이스에 저장되어 영구적으로 보존</li>
          <li>사용자별 좋아요 상태 관리 (IP + User-Agent 기반)</li>
          <li>중복 좋아요 방지</li>
          <li>서버 사이드 렌더링 지원</li>
          <li>실시간 동기화</li>
        </ul>
      </article>

      {/* 포스트 하단의 좋아요 버튼 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            이 포스트가 도움이 되었나요?
          </p>
          <LikeButtonSupabase
            slug={slug}
            locale={locale}
            size="lg"
            showCount={true}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            좋아요를 누르면 공유링크가 클립보드에 복사됩니다.
          </p>
        </div>
      </footer>

      {/* 다양한 크기 예시 */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          다양한 크기 버튼 예시
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 작은 크기 */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Small Size
            </h3>
            <LikeButtonSupabase
              slug="example-small-supabase"
              locale={locale}
              size="sm"
              showCount={true}
            />
          </div>

          {/* 중간 크기 */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Medium Size
            </h3>
            <LikeButtonSupabase
              slug="example-medium-supabase"
              locale={locale}
              size="md"
              showCount={true}
            />
          </div>

          {/* 큰 크기 */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Large Size
            </h3>
            <LikeButtonSupabase
              slug="example-large-supabase"
              locale={locale}
              size="lg"
              showCount={true}
            />
          </div>
        </div>
      </section>

      {/* 개수 없는 버튼 예시 */}
      <section className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          개수 표시 없는 버튼
        </h2>
        <LikeButtonSupabase
          slug="example-no-count-supabase"
          locale={locale}
          size="md"
          showCount={false}
        />
      </section>

      {/* 기술적 설명 */}
      <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🔧 기술적 구현 사항
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              데이터베이스 구조
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• post_likes: 포스트별 좋아요 수</li>
              <li>• user_likes: 사용자별 좋아요 상태</li>
              <li>• 트리거로 자동 동기화</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              보안 및 성능
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Server Actions로 API 키 보호</li>
              <li>• IP + User-Agent 기반 세션</li>
              <li>• 낙관적 업데이트로 빠른 반응</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
