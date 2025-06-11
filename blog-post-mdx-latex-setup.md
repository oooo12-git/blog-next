# Next.js 15에서 MDX LaTeX 수식 렌더링 설정하기

_2025년 1월 27일_

Next.js 15 프로젝트에서 MDX 파일에 LaTeX 수식을 렌더링하려고 했지만 `$Y = f(X)$`와 같은 수식이 그대로 텍스트로 표시되는 문제가 발생했습니다. 이 문제를 해결하는 과정을 단계별로 정리해보겠습니다.

## 문제 상황

MDX 파일에서 다음과 같은 LaTeX 수식들이 텍스트로만 표시되고 수학 표기법으로 렌더링되지 않았습니다:

```markdown
$Y = f(X)$
$\hat{f}$
$\epsilon$
$$Y = f(X) + \epsilon$$
```

## 해결 과정

### 1. 필요한 패키지 설치

먼저 LaTeX 수식 렌더링을 위한 패키지들을 설치했습니다:

```bash
yarn add remark-math rehype-katex katex
```

- `remark-math`: 마크다운에서 수학 표기법을 파싱하는 플러그인
- `rehype-katex`: KaTeX를 사용하여 수학 표기법을 HTML로 렌더링하는 플러그인
- `katex`: 수학 표기법을 렌더링하는 라이브러리

### 2. KaTeX CSS 추가

`app/globals.css` 파일에 KaTeX 스타일을 추가했습니다:

```css
@import "tailwindcss";
@import "katex/dist/katex.min.css";
```

### 3. Next.js 설정 시행착오

처음에는 일반적인 방법으로 `next.config.ts`를 설정했지만 여러 에러가 발생했습니다:

```typescript
// ❌ 이 방법은 작동하지 않았습니다
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

**발생한 에러들:**

- `TypeError: Cannot use 'in' operator to search for 'plugins' in null`
- TypeScript 타입 에러: `'remarkPlugins' does not exist in type 'NextMDXOptions'`

### 4. 최종 해결: Turbopack과 함께 플러그인 사용

Next.js 공식 문서의 [Turbopack과 함께 플러그인 사용하기](https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack) 방법을 적용했습니다:

```typescript
// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  pageExtensions: ["md", "mdx", "ts", "tsx"],
};

const withNextIntl = createNextIntlPlugin();

const withMDX = createMDX({
  // @ts-ignore - Next.js 15 Turbopack 플러그인 설정 (공식 문서 방식)
  options: {
    remarkPlugins: [["remark-math", { strict: true, throwOnError: true }]],
    rehypePlugins: [["rehype-katex", { strict: true, throwOnError: true }]],
  },
});

export default withNextIntl(withMDX(nextConfig));
```

**핵심 포인트:**

- 플러그인을 배열 형태로 설정: `[["plugin-name", options]]`
- `@ts-ignore` 주석으로 TypeScript 타입 에러 무시
- Turbopack과 호환되는 직렬화 가능한 옵션 사용

### 5. LaTeX 문법 수정

MDX 파일에서 이중 백슬래시(`\\`)를 단일 백슬래시(`\`)로 수정했습니다:

```markdown
// ❌ 이전
$Y = f(X) + \\epsilon$
$Y=\\beta\_{1}X^{128902398}+\\beta\_{2}X^{8998}+\\beta\_{3}X^{139}+\\cdots$

// ✅ 수정 후
$Y = f(X) + \epsilon$
$Y=\beta_{1}X^{128902398}+\beta_{2}X^{8998}+\beta_{3}X^{139}+\cdots$
```

## 최종 결과

이제 MDX 파일에서 다음과 같은 LaTeX 수식을 사용할 수 있습니다:

### 인라인 수식

```markdown
변수 $Y = f(X)$는 함수 관계를 나타냅니다.
추정된 함수는 $\hat{f}$로 표기하며, 오차항은 $\epsilon$입니다.
```

### 블록 수식

```markdown
$$Y = f(X) + \epsilon$$

$$Y=\beta_{1}X^{128902398}+\beta_{2}X^{8998}+\beta_{3}X^{139}+\cdots$$
```

## 주요 학습사항

1. **Next.js 15 + Turbopack 환경**에서는 기존 MDX 플러그인 설정 방법이 다릅니다.
2. **공식 문서의 Turbopack 섹션**을 참조하는 것이 중요합니다.
3. **플러그인 옵션은 직렬화 가능한 형태**로 제공해야 합니다.
4. **TypeScript 타입 에러**는 `@ts-ignore`로 임시 해결할 수 있습니다.
5. **LaTeX 문법**에서 MDX 환경에서는 단일 백슬래시를 사용해야 합니다.

## 참고 자료

- [Next.js MDX 공식 문서](https://nextjs.org/docs/app/guides/mdx)
- [Turbopack과 함께 플러그인 사용하기](https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack)
- [KaTeX 공식 문서](https://katex.org/)
- [remark-math GitHub](https://github.com/remarkjs/remark-math)
- [rehype-katex GitHub](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex)

---

이 과정을 통해 Next.js 15 환경에서도 MDX 파일에서 아름다운 수학 표기법을 사용할 수 있게 되었습니다. 비슷한 문제를 겪는 개발자들에게 도움이 되길 바랍니다.
