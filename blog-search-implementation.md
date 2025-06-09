# Next.js 블로그에서 실시간 검색 기능 구현하기

블로그나 문서 사이트에서 사용자가 원하는 콘텐츠를 빠르게 찾을 수 있도록 도와주는 검색 기능은 필수적입니다. 이번 포스트에서는 Next.js와 TypeScript를 사용하여 실시간 검색 기능을 구현하는 방법을 단계별로 살펴보겠습니다.

## 🔍 구현 기능 개요

이번에 구현한 검색 기능의 주요 특징은 다음과 같습니다:

- **실시간 검색**: 타이핑과 동시에 검색 결과 표시
- **키보드 단축키**: `Cmd/Ctrl + K`로 빠른 검색 모달 열기
- **키보드 네비게이션**: 화살표 키와 Enter로 결과 탐색
- **검색어 하이라이팅**: 검색된 텍스트 강조 표시
- **디바운싱**: 불필요한 API 호출 방지
- **반응형 디자인**: 모든 디바이스에서 최적화
- **다국어 지원**: i18n 국제화 대응

## 📁 컴포넌트 구조

검색 기능은 두 개의 주요 컴포넌트로 구성됩니다:

1. **Search.tsx**: 검색 버튼과 키보드 단축키 관리
2. **SearchModal.tsx**: 실제 검색 로직과 모달 UI

## 🔧 Search 컴포넌트 구현

### 기본 구조

```typescript
"use client";

import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";

type SearchProps = {
  interClass: string;
  locale?: string;
};

export default function Search({ interClass, locale = "ko" }: SearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ...
}
```

### 키보드 단축키 구현

사용자 경험을 향상시키기 위해 `Cmd/Ctrl + K` 단축키를 구현했습니다:

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);
```

**핵심 포인트:**

- `metaKey`: Mac의 Cmd 키 감지
- `ctrlKey`: Windows/Linux의 Ctrl 키 감지
- `preventDefault()`: 브라우저 기본 동작 방지
- 클린업 함수로 메모리 누수 방지

### 검색 버튼 UI

```typescript
<div className="flex items-center w-[120px] sm:w-[160px]">
  <div
    className="flex items-center justify-center rounded-[10px] bg-[#ECEAEA] gradient-hongkong-night border border-black border-opacity-50 h-[20px] sm:h-[23px] w-full cursor-pointer hover:bg-gray-200 transition-colors"
    onClick={handleClick}
  >
    {/* 검색 아이콘 */}
    <button type="button" className="h-full flex items-center px-1">
      <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" /* ... */>
        {/* SVG path */}
      </svg>
    </button>

    {/* 검색 텍스트 */}
    <div
      className={`h-full w-auto bg-transparent text-xs text-center font-light dark:text-gray-300 flex items-center justify-center flex-1 ${interClass}`}
    >
      Search
    </div>

    {/* 키보드 단축키 힌트 */}
    <div className="text-xs text-gray-400 pr-2 hidden sm:block">⌘K</div>
  </div>
</div>
```

## 🔍 SearchModal 컴포넌트 구현

### 상태 관리

```typescript
const [query, setQuery] = useState("");
const [results, setResults] = useState<Post[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(-1);
const inputRef = useRef<HTMLInputElement>(null);
```

각 상태의 역할:

- `query`: 현재 검색어
- `results`: 검색 결과 배열
- `isLoading`: 로딩 상태
- `selectedIndex`: 키보드로 선택된 항목 인덱스
- `inputRef`: 검색 입력 필드 참조

### 디바운싱된 검색 구현

#### 디바운싱이란?

**디바운싱(Debouncing)**은 연속적으로 발생하는 이벤트에서 마지막 이벤트만 실행하도록 하는 프로그래밍 기법입니다. 사용자가 검색어를 입력할 때마다 즉시 API를 호출하면 다음과 같은 문제가 발생합니다:

- **과도한 API 호출**: "React"를 검색하려고 할 때 'R', 'Re', 'Rea', 'Reac', 'React' 총 5번의 API 호출
- **서버 부하**: 불필요한 요청으로 인한 서버 리소스 낭비
- **사용자 경험 저하**: 너무 빈번한 결과 업데이트로 인한 화면 깜빡임
- **네트워크 비용**: 모바일 환경에서 데이터 사용량 증가

#### 디바운싱 작동 원리

```typescript
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    performSearch(query);
  }, 300); // 300ms 지연

  return () => clearTimeout(debounceTimer);
}, [query, locale]);
```

**작동 과정:**

1. **사용자 입력**: 사용자가 문자를 입력
2. **타이머 설정**: 300ms 후에 검색을 실행하도록 타이머 설정
3. **추가 입력 감지**: 300ms 이내에 추가 입력이 있으면 기존 타이머 취소
4. **새 타이머 설정**: 다시 300ms 타이머를 새로 설정
5. **검색 실행**: 300ms 동안 추가 입력이 없으면 최종적으로 검색 실행

#### 실제 예시

사용자가 "JavaScript"를 입력하는 경우:

```
시간    입력    타이머 상태           API 호출
0ms     J      300ms 타이머 시작      ❌
50ms    a      이전 타이머 취소       ❌
                300ms 타이머 재시작
120ms   v      이전 타이머 취소       ❌
                300ms 타이머 재시작
200ms   a      이전 타이머 취소       ❌
                300ms 타이머 재시작
...
1000ms  t      이전 타이머 취소       ❌
                300ms 타이머 재시작
1300ms  -      타이머 만료            ✅ "JavaScript" 검색 실행
```

디바운싱 없이는 10번의 API 호출이 발생하지만, 디바운싱을 적용하면 1번만 호출됩니다.

#### 최적화 고려사항

**1. 지연 시간 선택:**

```typescript
// 너무 짧음 (100ms) - 여전히 많은 API 호출
// 너무 김 (1000ms) - 사용자 경험 저하
// 적절함 (300ms) - 성능과 UX의 균형
const DEBOUNCE_DELAY = 300;
```

**2. 메모리 누수 방지:**

```typescript
return () => clearTimeout(debounceTimer); // 클린업 필수
```

**3. 빈 검색어 처리:**

```typescript
const performSearch = async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    setResults([]); // 즉시 결과 클리어
    return;
  }
  // ... 검색 로직
};
```

#### 디바운싱의 장단점

**장점:**

- 📉 **API 호출 횟수 대폭 감소** (90% 이상 절약 가능)
- 🚀 **서버 부하 감소** 및 응답 속도 향상
- 💰 **비용 절약** (API 호출량 기반 과금 시)
- 🔋 **배터리 수명 연장** (모바일 환경)

**단점:**

- ⏱️ **약간의 지연** (300ms) 발생
- 🏃‍♂️ **빠른 타이퍼**에게는 답답할 수 있음

### 검색 함수

#### 클라이언트 측 검색 함수

```typescript
const performSearch = async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    setResults([]);
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`
    );
    if (response.ok) {
      const data = await response.json();
      setResults(data);
    }
  } catch (error) {
    console.error("검색 오류:", error);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
};
```

#### API 엔드포인트 구현

Next.js의 API Routes를 사용하여 검색 API를 구현합니다. `app/api/search/route.ts` 파일을 생성합니다:

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface PostMetadata {
  title: string;
  description: string;
  publishedAt: string;
  timeToRead: string;
  tags: string[];
  category?: string;
}

interface Post {
  slug: string;
  content: string;
  metadata: PostMetadata;
}

// 블로그 포스트 로드 함수
function loadPosts(locale: string): Post[] {
  const postsDirectory = path.join(process.cwd(), `content/${locale}`);

  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        content,
        metadata: {
          title: data.title || "",
          description: data.description || "",
          publishedAt: data.publishedAt || "",
          timeToRead: data.timeToRead || "5분",
          tags: Array.isArray(data.tags) ? data.tags : [],
          category: data.category,
        },
      };
    });

  return posts;
}

// 검색 로직
function searchPosts(posts: Post[], query: string): Post[] {
  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0);

  return posts
    .map((post) => {
      let score = 0;
      const titleLower = post.metadata.title.toLowerCase();
      const descriptionLower = post.metadata.description.toLowerCase();
      const contentLower = post.content.toLowerCase();
      const tagsLower = post.metadata.tags.join(" ").toLowerCase();

      searchTerms.forEach((term) => {
        // 제목에서 매칭 (가중치 3)
        if (titleLower.includes(term)) {
          score += 3;
        }

        // 설명에서 매칭 (가중치 2)
        if (descriptionLower.includes(term)) {
          score += 2;
        }

        // 태그에서 매칭 (가중치 2)
        if (tagsLower.includes(term)) {
          score += 2;
        }

        // 본문에서 매칭 (가중치 1)
        if (contentLower.includes(term)) {
          score += 1;
        }
      });

      return { ...post, score };
    })
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // 상위 10개 결과만 반환
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const locale = searchParams.get("locale") || "ko";

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    // 포스트 로드
    const posts = loadPosts(locale);

    // 검색 실행
    const results = searchPosts(posts, query.trim());

    // score 필드 제거 후 반환
    const cleanResults = results.map(({ score, ...post }) => post);

    return NextResponse.json(cleanResults);
  } catch (error) {
    console.error("검색 API 오류:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

#### API 응답 데이터 구조

검색 API는 다음과 같은 JSON 배열을 반환합니다:

```json
[
  {
    "slug": "react-hooks-guide",
    "metadata": {
      "title": "React Hooks 완벽 가이드",
      "description": "useState, useEffect, useContext 등 React Hooks의 모든 것을 알아보세요.",
      "publishedAt": "2024-01-15",
      "timeToRead": "8분",
      "tags": ["React", "JavaScript", "Hooks", "Frontend"],
      "category": "개발"
    }
  },
  {
    "slug": "next-js-optimization",
    "metadata": {
      "title": "Next.js 성능 최적화 기법",
      "description": "이미지 최적화, 코드 분할, 메모이제이션을 통한 Next.js 앱 성능 향상",
      "publishedAt": "2024-01-20",
      "timeToRead": "12분",
      "tags": ["Next.js", "Performance", "Optimization"],
      "category": "웹개발"
    }
  }
]
```

#### 검색 알고리즘 상세 분석

**1. 검색어 처리:**

```typescript
const searchTerms = query
  .toLowerCase()
  .split(" ")
  .filter((term) => term.length > 0);
```

- 대소문자 구분 없는 검색
- 공백으로 구분된 여러 검색어 지원
- 빈 문자열 필터링

**2. 스코어링 시스템:**

- **제목 매칭**: 3점 (가장 중요)
- **설명 매칭**: 2점
- **태그 매칭**: 2점
- **본문 매칭**: 1점 (가장 기본)

**3. 검색 결과 예시:**

"React Hook" 검색 시:

```typescript
// 입력: "React Hook"
// searchTerms: ["react", "hook"]

// 스코어 계산 예시:
// 포스트 1: "React Hooks 완벽 가이드"
// - 제목에 "react" 포함: +3점
// - 제목에 "hook" 포함: +3점
// - 총점: 6점

// 포스트 2: "Vue.js 상태 관리"
// - 본문에 "react" 언급: +1점
// - hook 관련 내용 없음: 0점
// - 총점: 1점
```

#### 클라이언트 측 데이터 처리

```typescript
// API 응답 후 클라이언트에서 처리
if (response.ok) {
  const data: Post[] = await response.json();
  setResults(data);

  // 검색 결과 개수 표시
  console.log(`${data.length}개의 검색 결과를 찾았습니다.`);

  // 각 결과의 메타데이터 활용
  data.forEach((post) => {
    console.log(`제목: ${post.metadata.title}`);
    console.log(`태그: ${post.metadata.tags.join(", ")}`);
  });
}
```

#### 오류 처리 및 예외 상황

**1. 네트워크 오류:**

```typescript
catch (error) {
  console.error("검색 오류:", error);
  setResults([]);
  // 사용자에게 오류 메시지 표시 가능
}
```

**2. API 서버 오류 (500):**

```typescript
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}
```

**3. 빈 결과 처리:**

```typescript
if (!query || query.trim().length === 0) {
  return NextResponse.json([]);
}
```

#### 성능 최적화 고려사항

**1. 캐싱 전략:**

```typescript
// 메모리 캐시 (개발 환경)
const cache = new Map();

export async function GET(request: NextRequest) {
  const cacheKey = `${query}-${locale}`;

  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }

  const results = searchPosts(posts, query);
  cache.set(cacheKey, results);

  return NextResponse.json(results);
}
```

**2. 검색 결과 제한:**

```typescript
.slice(0, 10) // 상위 10개만 반환하여 응답 크기 최소화
```

**3. URL 인코딩:**

```typescript
encodeURIComponent(searchQuery); // 특수문자 안전 처리
```

#### 주요 특징 요약

- ✅ **빈 검색어 처리**: 불필요한 API 호출 방지
- ✅ **URL 인코딩**: 특수문자 포함 검색어 안전 처리
- ✅ **에러 처리**: 네트워크 오류 및 서버 오류 대응
- ✅ **로딩 상태**: 사용자에게 진행 상황 표시
- ✅ **다국어 지원**: locale 파라미터로 언어별 검색
- ✅ **스코어링**: 관련도 기반 검색 결과 정렬
- ✅ **결과 제한**: 성능 최적화를 위한 결과 개수 제한

### 키보드 네비게이션

사용자가 키보드만으로도 검색 결과를 탐색할 수 있도록 구현했습니다:

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Escape") {
    onClose();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setSelectedIndex((prev) => Math.max(prev - 1, -1));
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault();
    const selectedPost = results[selectedIndex];
    router.push(`/${locale}/blog/${selectedPost.slug}`);
    onClose();
  }
};
```

**키보드 컨트롤:**

- `Escape`: 모달 닫기
- `ArrowDown/ArrowUp`: 결과 탐색
- `Enter`: 선택된 포스트로 이동

### 검색어 하이라이팅

사용자가 검색한 텍스트를 시각적으로 강조하는 기능입니다:

```typescript
const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text;

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-600">
        {part}
      </mark>
    ) : (
      part
    )
  );
};
```

### 검색 결과 UI

```typescript
{
  results.map((post, index) => (
    <div
      key={post.slug}
      className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
        selectedIndex === index
          ? "bg-gray-100 gradient-hongkong-light"
          : "hover:bg-gray-50 gradient-hongkong-subtle hover:gradient-hongkong-subtle"
      }`}
      onClick={() => handlePostClick(post.slug)}
    >
      <div className="flex flex-col space-y-1">
        <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2">
          {highlightText(post.metadata.title, query)}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {highlightText(post.metadata.description, query)}
        </p>
        <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{post.metadata.publishedAt}</span>
          <span className="hidden sm:inline">•</span>
          <span className="sm:inline hidden">
            {post.metadata.timeToRead}
            {t("timeToRead")}
          </span>
          {/* 태그 표시 */}
        </div>
      </div>
    </div>
  ));
}
```

## 🎨 UX/UI 디자인 고려사항

### 1. 반응형 디자인

- 모바일과 데스크톱에서 다른 레이아웃 적용
- `sm:` 접두사로 반응형 스타일링

### 2. 다크 모드 지원

- `dark:` 접두사로 다크 모드 스타일 정의
- 색상 대비 고려한 접근성 개선

### 3. 로딩 상태 표시

```typescript
{
  isLoading && (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100 flex-shrink-0"></div>
  );
}
```

### 4. 빈 결과 처리

```typescript
{
  query.trim() && !isLoading && results.length === 0 && (
    <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
      {t("noResults")}
    </div>
  );
}
```

## 🌐 국제화 (i18n) 지원

Next.js의 `next-intl` 라이브러리를 사용하여 다국어를 지원합니다:

```typescript
const t = useTranslations("search");

// 사용 예시
placeholder={t("placeholder")}
{t("noResults")}
{t("explore")}
{t("select")}
{t("close")}
```

## 🚀 성능 최적화

### 1. 디바운싱

- 300ms 지연으로 불필요한 API 호출 방지

### 2. 메모리 관리

- useEffect 클린업 함수로 이벤트 리스너 정리
- 타이머 정리로 메모리 누수 방지

### 3. 조건부 렌더링

- 모달이 닫혀있을 때 DOM에서 완전히 제거
- `if (!isOpen) return null;`

## 📱 사용자 경험 (UX) 개선

### 1. 즉각적인 피드백

- 타이핑과 동시에 검색 결과 표시
- 로딩 스피너로 진행 상태 표시

### 2. 키보드 우선 인터페이스

- 마우스 없이도 완전한 기능 사용 가능
- 단축키와 화살표 키 네비게이션

### 3. 시각적 피드백

- 선택된 항목 하이라이팅
- 검색어 텍스트 강조 표시

## 🔮 향후 개선 방안

1. **검색 히스토리**: 최근 검색어 저장 및 표시
2. **검색 필터**: 카테고리, 태그별 필터링
3. **검색 통계**: 인기 검색어 분석
4. **오타 자동 수정**: 검색어 제안 기능
5. **전문 검색**: 고급 검색 옵션 추가

## 🌍 다국어 검색 구현 (NextIntlClientProvider)

Next.js 다국어 블로그에서 검색 기능을 구현할 때, 각 언어별로 올바른 콘텐츠가 검색되도록 하는 것이 중요합니다. 이 섹션에서는 `NextIntlClientProvider`와 `useLocale` 훅을 활용한 다국어 검색 구현 방법을 살펴보겠습니다.

### 문제 상황

기존 방식에서는 locale을 props로 전달하는 방식을 사용했습니다:

```typescript
// ❌ 문제가 있던 기존 방식 (prop drilling)
// layout.tsx
<Navbar locale={locale} />;

// Navbar.tsx
export default function Navbar({ locale }: { locale: string }) {
  return <Search locale={locale} />;
}

// Search.tsx
export default function Search({ locale }: { locale: string }) {
  return <SearchModal locale={locale} />;
}
```

이 방식의 문제점:

- **Prop drilling**: 여러 컴포넌트를 거쳐 locale을 전달해야 함
- **유지보수성 저하**: locale이 필요한 컴포넌트가 늘어날 때마다 모든 중간 컴포넌트 수정 필요
- **타입 안전성**: 각 컴포넌트에서 locale props 타입 정의 필요

### 해결 방법: useLocale 훅 활용

Next.js의 `next-intl` 라이브러리에서 제공하는 `useLocale` 훅을 사용하면 더 깔끔하게 해결할 수 있습니다.

#### 1. NextIntlClientProvider 설정

```typescript
// app/[locale]/layout.tsx
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <Navbar /> {/* locale prop 전달 불필요 */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### 2. useLocale 훅으로 locale 접근

```typescript
// app/components/Search.tsx
"use client";

import { useLocale } from "next-intl";
import SearchModal from "./SearchModal";

export default function Search({ interClass }: { interClass: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale(); // NextIntlClientProvider에서 자동으로 locale 가져오기

  return (
    <>
      {/* 검색 버튼 UI */}
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </>
  );
}
```

#### 3. API 호출에서 locale 활용

```typescript
// app/components/SearchModal.tsx
const performSearch = async (searchQuery: string) => {
  if (!searchQuery.trim()) {
    setResults([]);
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`
    );
    if (response.ok) {
      const data = await response.json();
      setResults(data);
    }
  } catch (error) {
    console.error("검색 오류:", error);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
};
```

#### 4. 서버 API에서 locale별 검색 처리

```typescript
// app/api/search/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const locale = searchParams.get("locale") || "ko";

  if (!query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // locale에 따라 해당 언어의 콘텐츠 검색
    const results = await searchPosts(locale, query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

#### 5. utils 함수에서 locale별 파일 로드

```typescript
// lib/utils.ts
export async function getPost(slug: string, locale: string): Promise<Post> {
  // locale에 따라 해당 언어 파일 로드
  const file = await import(`../contents/${slug}/${locale}.mdx`);

  if (file?.metadata) {
    return {
      slug,
      metadata: {
        ...file.metadata,
      },
    };
  }

  throw new Error(`Unable to find metadata for ${slug}.mdx`);
}

export async function searchPosts(
  locale: string,
  query: string,
  limit = 10
): Promise<Post[]> {
  const postSlugs = getPostSlugs();
  const searchQuery = query.toLowerCase().trim();

  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      try {
        // 각 포스트를 해당 locale로 로드
        const postData = await getPost(slug, locale);
        return { ...postData, slug };
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
      }
    })
  );

  const validPosts = posts.filter((post): post is Post => post !== null);

  // 해당 언어의 제목, 설명, 태그에서 검색
  const matchedPosts = validPosts.filter((post) => {
    const titleMatch = post.metadata.title.toLowerCase().includes(searchQuery);
    const descriptionMatch = post.metadata.description
      .toLowerCase()
      .includes(searchQuery);
    const tagsMatch = post.metadata.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );

    return titleMatch || descriptionMatch || tagsMatch;
  });

  // 관련성 점수 계산 및 정렬
  const scoredPosts = matchedPosts.map((post) => {
    let score = 0;
    const title = post.metadata.title.toLowerCase();
    const description = post.metadata.description.toLowerCase();

    // 제목 매칭 (가장 높은 가중치)
    if (title.includes(searchQuery)) {
      score += title.indexOf(searchQuery) === 0 ? 10 : 5;
    }

    // 설명 매칭
    if (description.includes(searchQuery)) {
      score += 3;
    }

    // 태그 매칭
    if (
      post.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    ) {
      score += 2;
    }

    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
```

### 결과

이제 다국어 검색이 올바르게 작동합니다:

#### 메타데이터 매칭

```
Building a Multilingual Blog with Quarto - Guide
Quarto를 활용한 다국어 블로그 만들기 - 가이드
2023-11-19 • 12분 읽기 • R Quarto Blog
```

#### 본문 매칭 + 스니펫 표시

```
Building a Multilingual Blog with Quarto - Guide
Quarto를 활용한 다국어 블로그 만들기 - 가이드

│ 본문: ...Rstudio를 사용하여 진행한다. Quarto는 픽스와 업데이트가 많기 때문에...

2023-11-19 • 12분 읽기 • R Quarto Blog
```

### 장점

1. **포괄적인 검색**: 제목, 설명, 태그뿐만 아니라 본문 내용까지 검색
2. **컨텍스트 제공**: 매칭된 본문 부분의 스니펫으로 관련성 확인 가능
3. **시각적 구분**: 본문 스니펫을 별도 영역으로 표시하여 구분
4. **하이라이팅**: 검색어가 노란색으로 강조되어 쉽게 식별
5. **성능 최적화**: 스니펫 길이 제한으로 UI 성능 유지
6. **다크 모드 지원**: 라이트/다크 테마 모두 지원

### 사용 예시

**"Rstudio" 검색 시:**

- 제목에 없지만 본문에 "Rstudio를 사용하여 진행한다"가 있는 포스트 발견
- 해당 부분의 스니펫이 표시되어 사용자가 관련성 확인 가능

**"netlify" 검색 시:**

- 본문에 "netlify를 선택한 이유는"이 포함된 포스트들 검색
- 각 매칭 부분의 컨텍스트가 스니펫으로 제공

이러한 기능으로 사용자는 더 정확하고 유용한 검색 결과를 얻을 수 있습니다.

## 📄 본문 검색 및 스니펫 표시 기능

기본적인 검색 기능에서 한 단계 더 나아가 MDX 파일의 본문 내용도 검색하고, 매칭된 부분의 스니펫을 미리보기로 표시하는 기능을 구현할 수 있습니다.

### 문제 상황

초기 검색 기능은 메타데이터(제목, 설명, 태그)에서만 검색이 가능했습니다:

```typescript
// ❌ 기존 방식: 메타데이터만 검색
const matchedPosts = validPosts.filter((post) => {
  const titleMatch = post.metadata.title.toLowerCase().includes(searchQuery);
  const descriptionMatch = post.metadata.description
    .toLowerCase()
    .includes(searchQuery);
  const tagsMatch = post.metadata.tags.some((tag) =>
    tag.toLowerCase().includes(searchQuery)
  );

  return titleMatch || descriptionMatch || tagsMatch; // 본문 검색 없음
});
```

이 방식의 한계:

- **제한된 검색 범위**: 본문에 있는 중요한 내용들을 찾을 수 없음
- **정보 부족**: 검색 결과에서 실제 매칭된 내용을 확인할 수 없음
- **사용자 경험 저하**: 검색어와 관련된 구체적인 정보를 미리 볼 수 없음

### 해결 방법: 본문 검색 및 스니펫 표시

#### 1. 본문 텍스트 추출 함수

MDX 파일에서 순수 텍스트만 추출하는 함수를 구현합니다:

````typescript
// 검색을 위한 본문 텍스트 추출 함수
function extractSearchableContent(mdxContent: string): string {
  // MDX 메타데이터 제거 (export const metadata = {...} 부분)
  const contentWithoutMetadata = mdxContent.replace(
    /export\s+const\s+metadata\s*=\s*{[\s\S]*?};\s*/,
    ""
  );

  // 마크다운 문법 제거하여 순수 텍스트만 추출
  const plainText = contentWithoutMetadata
    .replace(/#{1,6}\s+/g, "") // 제목 (# ## ###)
    .replace(/\*\*(.*?)\*\*/g, "$1") // 굵게
    .replace(/\*(.*?)\*/g, "$1") // 기울임
    .replace(/`(.*?)`/g, "$1") // 인라인 코드
    .replace(/```[\s\S]*?```/g, "") // 코드 블록
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 링크
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 이미지
    .replace(/^\s*[-*+]\s+/gm, "") // 리스트
    .replace(/^\s*\d+\.\s+/gm, "") // 번호 목록
    .replace(/import\s+.*?from\s+.*?;/g, "") // import 문
    .replace(/<[^>]*>/g, "") // HTML 태그
    .replace(/\n+/g, " ") // 개행을 공백으로
    .trim();

  return plainText;
}
````

**처리하는 마크다운 요소들:**

- 제목 (`#`, `##`, `###`)
- 텍스트 스타일링 (`**굵게**`, `*기울임*`)
- 코드 (`` `인라인` ``, ` ```블록``` `)
- 링크 (`[텍스트](URL)`)
- 이미지 (`![alt](src)`)
- 리스트 (`-`, `*`, `1.`)
- HTML 태그 (`<div>`, `<span>` 등)
- import 문

#### 2. 스니펫 추출 함수

검색어가 매칭된 부분의 스니펫을 추출하는 함수입니다:

```typescript
// 검색어가 매칭된 본문 스니펫 추출 함수
function extractMatchingSnippet(
  content: string,
  searchQuery: string,
  maxLength = 150
): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = searchQuery.toLowerCase();

  const matchIndex = lowerContent.indexOf(lowerQuery);
  if (matchIndex === -1) return "";

  // 매칭된 부분 앞뒤로 컨텍스트 추가
  const contextLength = Math.floor((maxLength - searchQuery.length) / 2);
  const start = Math.max(0, matchIndex - contextLength);
  const end = Math.min(
    content.length,
    matchIndex + searchQuery.length + contextLength
  );

  let snippet = content.substring(start, end);

  // 앞뒤가 잘렸으면 ... 추가
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";

  return snippet;
}
```

**스니펫 추출 로직:**

1. 검색어가 포함된 위치 찾기
2. 앞뒤로 적절한 컨텍스트 길이 계산
3. 최대 길이(150자) 내에서 의미 있는 스니펫 추출
4. 잘린 부분에 "..." 표시

#### 3. 확장된 Post 인터페이스

스니펫 정보를 포함하는 인터페이스를 정의합니다:

```typescript
// Post 인터페이스 확장
export interface PostWithSnippet extends Post {
  contentSnippet?: string;
}
```

#### 4. 개선된 searchPosts 함수

본문 검색과 스니펫 추출을 포함한 완전한 검색 함수입니다:

```typescript
export async function searchPosts(
  locale: string,
  query: string,
  limit = 10
): Promise<PostWithSnippet[]> {
  if (!query.trim()) {
    return [];
  }

  const postSlugs = getPostSlugs();
  const searchQuery = query.toLowerCase().trim();

  const posts = await Promise.all(
    postSlugs.map(async (slug) => {
      try {
        const postData = await getPost(slug, locale);

        // 본문 내용도 검색하기 위해 MDX 파일 읽기
        const mdxContent = await readMdxContent(slug, locale);
        const searchableContent = extractSearchableContent(mdxContent);

        return {
          ...postData,
          slug,
          searchableContent: searchableContent.toLowerCase(),
          originalContent: searchableContent, // 원본 텍스트 (대소문자 유지)
        };
      } catch (error) {
        console.error(`Error loading post ${slug}:`, error);
        return null;
      }
    })
  );

  const validPosts = posts.filter(
    (
      post
    ): post is Post & { searchableContent: string; originalContent: string } =>
      post !== null
  );

  // 제목, 설명, 태그, 본문에서 검색
  const matchedPosts = validPosts.filter((post) => {
    const titleMatch = post.metadata.title.toLowerCase().includes(searchQuery);
    const descriptionMatch = post.metadata.description
      .toLowerCase()
      .includes(searchQuery);
    const tagsMatch = post.metadata.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );
    const contentMatch = post.searchableContent.includes(searchQuery);

    return titleMatch || descriptionMatch || tagsMatch || contentMatch;
  });

  // 관련성 점수 계산 및 스니펫 추출
  const scoredPosts = matchedPosts.map((post) => {
    let score = 0;
    const title = post.metadata.title.toLowerCase();
    const description = post.metadata.description.toLowerCase();

    // 제목 매칭 (가장 높은 가중치)
    if (title.includes(searchQuery)) {
      score += title.indexOf(searchQuery) === 0 ? 10 : 5;
    }

    // 설명 매칭
    if (description.includes(searchQuery)) {
      score += 3;
    }

    // 태그 매칭
    if (
      post.metadata.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    ) {
      score += 2;
    }

    // 본문 매칭 및 스니펫 추출
    let contentSnippet = "";
    if (post.searchableContent.includes(searchQuery)) {
      score += 1;
      contentSnippet = extractMatchingSnippet(
        post.originalContent,
        searchQuery
      );
    }

    return {
      post: {
        slug: post.slug,
        metadata: post.metadata,
        contentSnippet: contentSnippet || undefined,
      },
      score,
    };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
```

### 5. SearchModal UI 개선

본문 스니펫을 표시하는 UI를 추가합니다:

```typescript
// app/components/SearchModal.tsx
import { PostWithSnippet } from "@/lib/utils";

export default function SearchModal({
  isOpen,
  onClose,
  locale,
}: SearchModalProps) {
  const [results, setResults] = useState<PostWithSnippet[]>([]);

  return (
    <div className="search-modal">
      {results.map((post, index) => (
        <div key={post.slug} className="search-result">
          <h3>{highlightText(post.metadata.title, query)}</h3>
          <p>{highlightText(post.metadata.description, query)}</p>

          {/* 본문 스니펫 표시 */}
          {post.contentSnippet && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-gray-300 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                본문:{" "}
              </span>
              {highlightText(post.contentSnippet, query)}
            </div>
          )}

          {/* 태그 및 메타 정보 */}
        </div>
      ))}
    </div>
  );
}
```

### 스코어링 시스템

확장된 스코어링 시스템은 다음과 같은 우선순위를 가집니다:

| 매칭 위치 | 점수 | 설명                          |
| --------- | ---- | ----------------------------- |
| 제목 시작 | 10점 | 제목이 검색어로 시작하는 경우 |
| 제목 중간 | 5점  | 제목에 검색어가 포함된 경우   |
| 설명      | 3점  | 설명에 검색어가 포함된 경우   |
| 태그      | 2점  | 태그에 검색어가 포함된 경우   |
| 본문      | 1점  | 본문에 검색어가 포함된 경우   |

### 결과

이제 다음과 같은 고급 검색이 가능합니다:

#### 메타데이터 매칭

```
Building a Multilingual Blog with Quarto - Guide
Quarto를 활용한 다국어 블로그 만들기 - 가이드
2023-11-19 • 12분 읽기 • R Quarto Blog
```

#### 본문 매칭 + 스니펫 표시

```
Building a Multilingual Blog with Quarto - Guide
Quarto를 활용한 다국어 블로그 만들기 - 가이드

│ 본문: ...Rstudio를 사용하여 진행한다. Quarto는 픽스와 업데이트가 많기 때문에...

2023-11-19 • 12분 읽기 • R Quarto Blog
```

### 장점

1. **포괄적인 검색**: 제목, 설명, 태그뿐만 아니라 본문 내용까지 검색
2. **컨텍스트 제공**: 매칭된 본문 부분의 스니펫으로 관련성 확인 가능
3. **시각적 구분**: 본문 스니펫을 별도 영역으로 표시하여 구분
4. **하이라이팅**: 검색어가 노란색으로 강조되어 쉽게 식별
5. **성능 최적화**: 스니펫 길이 제한으로 UI 성능 유지
6. **다크 모드 지원**: 라이트/다크 테마 모두 지원

### 사용 예시

**"Rstudio" 검색 시:**

- 제목에 없지만 본문에 "Rstudio를 사용하여 진행한다"가 있는 포스트 발견
- 해당 부분의 스니펫이 표시되어 사용자가 관련성 확인 가능

**"netlify" 검색 시:**

- 본문에 "netlify를 선택한 이유는"이 포함된 포스트들 검색
- 각 매칭 부분의 컨텍스트가 스니펫으로 제공

이러한 기능으로 사용자는 더 정확하고 유용한 검색 결과를 얻을 수 있습니다.

## 마무리

이번 포스트에서는 Next.js를 사용하여 실시간 검색 기능을 구현하는 방법을 살펴보았습니다. 사용자 경험을 고려한 키보드 네비게이션, 디바운싱을 통한 성능 최적화, 그리고 반응형 디자인까지 포함한 완전한 검색 기능을 구현했습니다.

특히 다국어 블로그에서는 `NextIntlClientProvider`와 `useLocale` 훅을 활용하여 각 언어별로 올바른 콘텐츠가 검색되도록 하는 것이 중요합니다. 이러한 접근 방식은 prop drilling을 피하고 더 깔끔하고 유지보수하기 쉬운 코드를 작성할 수 있게 해줍니다.

이러한 검색 기능은 블로그나 문서 사이트의 사용성을 크게 향상시킬 수 있으며, 사용자가 원하는 콘텐츠를 빠르고 효율적으로 찾을 수 있도록 도와줍니다.

코드의 각 부분은 재사용 가능하도록 모듈화되어 있어, 다른 프로젝트에서도 쉽게 적용할 수 있습니다. 여러분의 프로젝트에도 이러한 검색 기능을 추가해보시기 바랍니다!
