# 블로그 조회수 기능 설정 가이드

## 개요

이 가이드는 Next.js 블로그에 조회수 기능을 구현하는 방법을 설명합니다. 각 게시글에 들어갈 때마다 조회수가 자동으로 증가합니다.

## 구현된 기능

- ✅ 게시글별 조회수 저장 (Supabase)
- ✅ 페이지 방문 시 자동 조회수 증가
- ✅ 실시간 조회수 표시
- ✅ 중복 증가 방지 (동일 세션 내)
- ✅ 천 단위 콤마 포맷팅
- ✅ 심플하고 명확한 데이터 구조

## 설정 단계

### 1. Supabase 데이터베이스 테이블 생성

Supabase 대시보드의 SQL Editor에서 다음 파일의 내용을 실행하세요:

```bash
sql/create_post_views_table.sql
```

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

### 📁 lib/utils.ts

- `getPostViewCount()`: 특정 게시글의 조회수 조회
- `incrementPostViewCount()`: 조회수 증가 처리

### 📁 lib/actions.ts

- `incrementViewCount()`: Server Action으로 클라이언트에서 호출 가능한 조회수 증가 함수

### 📁 app/components/ViewCounter.tsx

- 클라이언트 컴포넌트로 조회수 표시 및 증가 로직 처리
- 중복 호출 방지 기능 포함

### 📁 app/[locale]/blog/[slug]/page.tsx

- 블로그 페이지에서 ViewCounter 컴포넌트 사용
- 초기 조회수 서버사이드에서 로드

## 데이터베이스 테이블 구조

```sql
post_views 테이블:
- id: Primary Key (자동 증가)
- slug: 게시글 슬러그 (유니크)
- view_count: 조회수
- last_viewed_at: 마지막 조회 시간
```

## 성능 최적화 사항

1. **인덱싱**: slug 컬럼에 인덱스 생성으로 조회 성능 향상
2. **중복 방지**: 동일 세션에서 중복 조회수 증가 방지
3. **에러 핸들링**: 데이터베이스 오류 시 기본값 반환
4. **캐시 무효화**: revalidatePath로 조회수 업데이트 즉시 반영
5. **심플한 구조**: 필수 컬럼만 유지하여 관리 포인트 최소화

## 사용 예시

조회수는 게시글 페이지에 자동으로 표시되며, 다음과 같은 형태로 나타납니다:

```
조회수: 1,234
```

게시글에 접속할 때마다 자동으로 조회수가 1씩 증가합니다.

## 문제 해결

### 조회수가 증가하지 않는 경우

1. Supabase 테이블이 올바르게 생성되었는지 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. Supabase RLS 정책이 올바르게 설정되었는지 확인

### 조회수가 표시되지 않는 경우

1. ViewCounter 컴포넌트가 올바르게 import되었는지 확인
2. getPostViewCount 함수가 올바르게 호출되는지 확인
3. 네트워크 탭에서 API 호출 상태 확인

## 데이터 분석 활용

### 최근 인기 게시글 조회

```sql
-- 최근 24시간 내 조회된 게시글
SELECT slug, view_count
FROM post_views
WHERE last_viewed_at > NOW() - INTERVAL '24 hours'
ORDER BY view_count DESC;
```

### 시간대별 방문 패턴 분석

```sql
-- 시간대별 조회 패턴
SELECT
  EXTRACT(HOUR FROM last_viewed_at) as hour,
  COUNT(*) as views
FROM post_views
WHERE last_viewed_at > NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour;
```

## 향후 개선 사항

- [ ] IP 기반 중복 방지
- [ ] 일일/주간/월간 조회수 통계
- [ ] 관리자 페이지에서 조회수 리셋 기능
- [ ] 조회수 기반 인기 게시글 정렬
- [ ] 조회수 통계 대시보드
