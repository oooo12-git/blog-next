# 🎯 **리뷰 포스트를 위한 조건부 JSON-LD 스키마 구현**

## 📋 **변경 사항 요약**

맛집 리뷰 포스트에 대해 더 구체적인 SEO 최적화를 위해 조건부 JSON-LD 스키마를 구현했습니다. 블로그 포스트의 태그와 메타데이터를 기반으로 `Review` 또는 `BlogPosting` 스키마를 동적으로 생성합니다.

## 🚀 **주요 기능**

- **조건부 스키마 생성**: 포스트 태그에 따라 적절한 JSON-LD 스키마 자동 선택
- **Review 스키마**: `맛집` 또는 `Restaurant` 태그가 있는 포스트에 적용
- **BlogPosting 스키마**: 일반 블로그 포스트에 기본 적용
- **메타데이터 검증**: `itemReviewed`와 `reviewRating` 필드 존재 여부 확인

## 📁 **수정된 파일**

- `app/[locale]/blog/[slug]/page.tsx`
  - `generateJsonLd` 함수 추가 및 구현
  - 조건부 로직으로 Review/BlogPosting 스키마 선택
  - 기존 정적 JSON-LD 객체를 동적 함수 호출로 교체

## 🔍 **구현 세부사항**

### 조건부 로직

```typescript
const isReview = post.metadata.tags?.some((tag: string) =>
  ["맛집", "Restaurant"].includes(tag)
);

if (isReview && post.metadata.itemReviewed && post.metadata.reviewRating) {
  // Review 스키마 생성
} else {
  // BlogPosting 스키마 생성 (기본값)
}
```

### Review 스키마 필드

- `@type: "Review"`
- `name`: 포스트 제목
- `itemReviewed`: 리뷰 대상 (메타데이터에서 가져옴)
- `reviewRating`: 평점 (메타데이터에서 가져옴)
- 기본 필드: `author`, `publisher`, `datePublished`, `dateModified` 등

### BlogPosting 스키마 필드 (기본값)

- `@type: "BlogPosting"`
- `headline`: 포스트 제목
- `description`: 포스트 설명
- `image`: 히어로 이미지 또는 기본 이미지
- `url`: 포스트 URL
- `mainEntityOfPage`: 웹페이지 정보
- `keywords`: 태그 목록
- `articleSection`: "Technology"
- `timeRequired`: 읽는 시간

## 📈 **SEO 개선 효과**

- **구체적인 구조화된 데이터**: 리뷰 포스트에 대해 검색 엔진이 더 정확하게 이해할 수 있는 스키마 제공
- **검색 결과 향상**: Review 스키마를 통해 별점, 리뷰 대상 정보 등이 검색 결과에 표시될 가능성 증가
- **하위 호환성**: 기존 BlogPosting 스키마는 그대로 유지하여 기존 포스트에 영향 없음
- **자동화**: 수동으로 스키마를 관리할 필요 없이 태그 기반으로 자동 적용

## 🧪 **테스트 방법**

1. **Review 스키마 확인**

   - 맛집 관련 포스트 (예: Zebra Restaurant, 광화문 미진) 페이지 소스에서 Review 스키마 확인
   - 개발자 도구에서 `<script type="application/ld+json">` 태그 내용 검사

2. **BlogPosting 스키마 확인**

   - 일반 블로그 포스트에서 BlogPosting 스키마 정상 생성 확인

3. **구조화된 데이터 검증**
   - [Google Rich Results Test](https://search.google.com/test/rich-results) 사용
   - [Schema.org Validator](https://validator.schema.org/) 사용

## 📝 **적용 대상 포스트**

### 현재 Review 스키마 적용 포스트

- `gwanghwamun-mijin` (광화문 미진 - 냉메밀국수 맛집)
- `zebra-restaurant` (제브라 레스토랑 - 이탈리안 레스토랑)

### 향후 적용 대상

- `맛집` 또는 `Restaurant` 태그가 있는 모든 포스트
- `itemReviewed`와 `reviewRating` 메타데이터가 포함된 포스트

## 🔧 **기술적 고려사항**

### 메타데이터 구조

리뷰 포스트는 다음과 같은 추가 메타데이터를 포함해야 합니다:

```typescript
interface ReviewMetadata {
  itemReviewed: {
    "@type": "Restaurant" | "Product" | "Service";
    name: string;
    address?: string;
    // 기타 필드...
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
}
```

### 다국어 지원

- 한국어(`ko`): `맛집` 태그 인식
- 영어(`en`): `Restaurant` 태그 인식
- 언어별 적절한 `inLanguage` 속성 설정

## ✅ **체크리스트**

- [x] `generateJsonLd` 함수 구현 완료
- [x] 조건부 로직 테스트 완료
- [x] Review/BlogPosting 스키마 정상 생성 확인
- [x] 기존 포스트에 영향 없음 확인
- [x] TypeScript 타입 안전성 확보
- [x] 다국어 지원 구현
- [x] 메타데이터 검증 로직 추가

## 🎉 **결과**

이 PR을 통해 맛집 리뷰 포스트의 SEO 성능이 개선되고, 검색 엔진에서 더 풍부한 결과를 제공할 수 있게 됩니다. 특히 구글 검색 결과에서 별점, 리뷰 대상 정보 등이 표시되어 클릭률(CTR) 향상을 기대할 수 있습니다. 🍽️✨

---

## 📚 **참고 자료**

- [Schema.org Review Documentation](https://schema.org/Review)
- [Google Search Central - Review structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [JSON-LD Best Practices](https://json-ld.org/)
