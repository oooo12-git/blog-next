# 블로그 통합 통계 시스템 설정 가이드 (조회수 + 좋아요)

## 개요

이 가이드는 Next.js 블로그에서 조회수와 좋아요를 통합 관리하는 시스템을 구현하는 방법을 설명합니다. 기존 post_views 테이블을 확장하여 조회수와 좋아요를 하나의 테이블에서 관리하고, 효율적인 통계 분석을 제공합니다.

## 구현된 기능

- ✅ 게시글별 좋아요 수 저장 (Supabase)
- ✅ 사용자별 좋아요 상태 관리 (IP + User-Agent 기반)
- ✅ 중복 좋아요 방지
- ✅ 실시간 좋아요 수 동기화
- ✅ 클릭 시 공유링크 자동 복사
- ✅ 하트 애니메이션 효과
- ✅ 다양한 크기 지원 (sm, md, lg)
- ✅ 다크모드 지원
- ✅ Server Actions로 보안 강화
- ✅ 낙관적 업데이트로 빠른 사용자 경험

## 설정 단계

### 1. Supabase 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 파일의 내용을 실행하세요:

```bash
sql/create_post_likes_table.sql
```

이 스크립트는 다음 테이블들을 생성합니다:

- `post_likes`: 포스트별 좋아요 총 개수
- `user_likes`: 사용자별 좋아요 상태
- 트리거: 자동 동기화 시스템

### 2. 환경 변수 확인

`.env.local` 파일에 Supabase 설정이 올바르게 되어있는지 확인하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 의존성 확인

필요한 패키지가 설치되어 있는지 확인하세요:

```bash
npm install @supabase/supabase-js
```

### 4. 애플리케이션 재시작

모든 설정이 완료되면 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 주요 파일 설명

### 📁 sql/create_post_likes_table.sql

- 좋아요 기능을 위한 데이터베이스 테이블 및 트리거 생성 스크립트

### 📁 lib/utils.ts

- `getPostLikeCount()`: 특정 게시글의 좋아요 수 조회
- `getUserLikeStatus()`: 사용자의 좋아요 상태 확인
- `togglePostLike()`: 좋아요 상태 토글

### 📁 lib/actions.ts

- `toggleLike()`: 좋아요 토글 Server Action
- `getLikeStatus()`: 좋아요 상태 조회 Server Action
- `generateUserSession()`: 사용자 세션 ID 생성

### 📁 app/components/LikeButtonSupabase.tsx

- Supabase와 연동된 좋아요 버튼 컴포넌트
- 실시간 상태 동기화 및 애니메이션 포함

### 📁 app/components/LikeButtonSupabaseExample.tsx

- 사용법을 보여주는 예시 컴포넌트

## 데이터베이스 구조

### post_likes 테이블

```sql
- id: Primary Key (자동 증가)
- slug: 게시글 슬러그 (유니크)
- like_count: 좋아요 총 개수
- last_liked_at: 마지막 좋아요 시간
- created_at: 생성 시간
```

### user_likes 테이블

```sql
- id: Primary Key (자동 증가)
- slug: 게시글 슬러그
- user_session: 사용자 세션 ID (IP + User-Agent 해시)
- liked: 좋아요 상태 (boolean)
- created_at: 생성 시간
- updated_at: 업데이트 시간
- UNIQUE(slug, user_session): 중복 방지
```

## 사용법

### 1. 기본 사용법

```tsx
import { LikeButtonSupabase } from "./components/LikeButtonSupabase";

export default function BlogPost({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  return (
    <div>
      <h1>블로그 포스트</h1>
      <p>포스트 내용...</p>

      {/* 기본 좋아요 버튼 */}
      <LikeButtonSupabase slug={slug} locale={locale} />
    </div>
  );
}
```

### 2. 포스트 중간과 하단에 동시 배치

```tsx
<article>
  <p>포스트 내용...</p>

  {/* 포스트 중간의 좋아요 버튼 */}
  <div className="text-center my-8">
    <LikeButtonSupabase slug={slug} locale={locale} size="md" />
  </div>

  <p>더 많은 내용...</p>

  {/* 포스트 하단의 좋아요 버튼 - 자동으로 상태 동기화됨 */}
  <footer className="text-center">
    <LikeButtonSupabase slug={slug} locale={locale} size="lg" />
  </footer>
</article>
```

### 3. 다양한 크기와 옵션

```tsx
{
  /* 작은 크기 */
}
<LikeButtonSupabase slug="post-1" locale="ko" size="sm" showCount={true} />;

{
  /* 중간 크기 (기본값) */
}
<LikeButtonSupabase slug="post-2" locale="ko" size="md" showCount={true} />;

{
  /* 큰 크기 */
}
<LikeButtonSupabase slug="post-3" locale="ko" size="lg" showCount={true} />;

{
  /* 개수 표시 없는 버튼 */
}
<LikeButtonSupabase slug="post-4" locale="ko" showCount={false} />;
```

## Props

### LikeButtonSupabase Props

| Prop           | Type                   | Default      | Description              |
| -------------- | ---------------------- | ------------ | ------------------------ |
| `slug`         | `string`               | **required** | 포스트의 고유 식별자     |
| `locale`       | `string`               | **required** | 언어/지역 코드           |
| `size`         | `'sm' \| 'md' \| 'lg'` | `'md'`       | 버튼 크기                |
| `showCount`    | `boolean`              | `true`       | 좋아요 개수 표시 여부    |
| `initialCount` | `number`               | `0`          | 초기 좋아요 개수 (SSR용) |
| `initialLiked` | `boolean`              | `false`      | 초기 좋아요 상태 (SSR용) |

## 기술적 특징

### 보안 강화

- **Server Actions**: API 키가 클라이언트에 노출되지 않음
- **RLS (Row Level Security)**: Supabase 행 수준 보안
- **세션 기반 인증**: IP + User-Agent 조합으로 사용자 식별

### 성능 최적화

- **낙관적 업데이트**: 클릭 즉시 UI 업데이트
- **인덱싱**: 데이터베이스 쿼리 최적화
- **트리거**: 자동 동기화로 별도 로직 불필요

### 사용자 경험

- **실시간 동기화**: 같은 포스트의 모든 버튼 상태 동기화
- **애니메이션**: 하트 박동 효과 및 호버 애니메이션
- **공유 기능**: 좋아요 클릭 시 링크 자동 복사
- **접근성**: 스크린 리더 지원 및 키보드 네비게이션

## 중복 방지 시스템

사용자 세션은 다음 방식으로 생성됩니다:

```typescript
// IP + User-Agent를 조합하여 고유 세션 ID 생성
const sessionString = `${ip}-${userAgent}`;
const sessionId = `session_${hash(sessionString)}`;
```

이를 통해:

- 같은 사용자가 중복으로 좋아요를 누르는 것을 방지
- 익명 사용자도 좋아요 상태 유지
- 쿠키나 로그인 없이도 중복 방지 가능

## 모니터링 및 분석

### 인기 포스트 조회

```sql
SELECT slug, like_count, last_liked_at
FROM post_likes
ORDER BY like_count DESC
LIMIT 10;
```

### 최근 좋아요 활동

```sql
SELECT slug, COUNT(*) as recent_likes
FROM user_likes
WHERE updated_at > NOW() - INTERVAL '7 days'
  AND liked = true
GROUP BY slug
ORDER BY recent_likes DESC;
```

### 사용자 참여도 분석

```sql
SELECT
  DATE(updated_at) as date,
  COUNT(DISTINCT user_session) as unique_users,
  COUNT(*) as total_likes
FROM user_likes
WHERE liked = true
  AND updated_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(updated_at)
ORDER BY date;
```

## 문제 해결

### 좋아요가 저장되지 않는 경우

1. Supabase 테이블이 올바르게 생성되었는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. 환경 변수가 올바르게 설정되었는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 상태 동기화가 안 되는 경우

1. 같은 `slug` 값을 사용하고 있는지 확인
2. 네트워크 에러가 없는지 확인
3. Server Actions가 올바르게 호출되는지 확인

### 성능 이슈가 있는 경우

1. 데이터베이스 인덱스가 올바르게 생성되었는지 확인
2. 불필요한 API 호출이 없는지 확인
3. 캐싱 전략 검토

## 기존 LocalStorage 버전과의 차이점

| 기능          | LocalStorage 버전 | Supabase 버전 |
| ------------- | ----------------- | ------------- |
| 데이터 저장   | 브라우저 로컬     | 데이터베이스  |
| 상태 유지     | 기기별            | 전역          |
| 중복 방지     | 로컬만            | 서버 기반     |
| 실시간 동기화 | 제한적            | 완전 지원     |
| 분석 가능     | 불가능            | 가능          |
| 확장성        | 제한적            | 높음          |

## 향후 개선 사항

- [ ] 로그인 사용자 지원
- [ ] 좋아요 취소 알림
- [ ] 좋아요 순 포스트 정렬
- [ ] 좋아요 통계 대시보드
- [ ] 소셜 로그인 연동
- [ ] 푸시 알림 지원
