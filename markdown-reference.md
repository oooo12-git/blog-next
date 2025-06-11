# 마크다운 기능 참고서

이 문서는 MDX 파일 작성 시 사용할 수 있는 다양한 마크다운 기능들을 정리한 참고서입니다.

## 1. 헤딩 (Headers)

```markdown
# H1 헤딩

## H2 헤딩

### H3 헤딩

#### H4 헤딩

##### H5 헤딩

###### H6 헤딩
```

## 2. 텍스트 스타일링

### 굵게, 기울임, 취소선

```markdown
**굵은 텍스트** 또는 **굵은 텍스트**
_기울임 텍스트_ 또는 _기울임 텍스트_
**_굵고 기울임_** 또는 **_굵고 기울임_**
~~취소선 텍스트~~
```

**굵은 텍스트** 또는 **굵은 텍스트**  
_기울임 텍스트_ 또는 _기울임 텍스트_  
**_굵고 기울임_** 또는 **_굵고 기울임_**  
~~취소선 텍스트~~

## 3. 목록 (Lists)

### 순서 없는 목록

```markdown
- 항목 1
- 항목 2
  - 하위 항목 2.1
  - 하위 항목 2.2
- 항목 3

* 또는 별표 사용

- 또는 플러스 사용
```

### 순서 있는 목록

```markdown
1. 첫 번째 항목
2. 두 번째 항목
   1. 하위 항목 2.1
   2. 하위 항목 2.2
3. 세 번째 항목
```

## 4. 링크 (Links)

```markdown
[링크 텍스트](https://example.com)
[링크 텍스트](https://example.com "툴팁 텍스트")
<https://example.com>
[참조 링크][ref-id]

[ref-id]: https://example.com "참조 링크"
```

## 5. 이미지 (Images)

```markdown
![대체 텍스트](image-url.jpg)
![대체 텍스트](image-url.jpg "이미지 제목")

<!-- 참조 방식 -->

![대체 텍스트][image-ref]
[image-ref]: image-url.jpg "이미지 제목"
```

### MDX에서 Next.js Image 컴포넌트 사용

```jsx
import Image from "next/image";

<Image
  src="/path/to/image.jpg"
  alt="이미지 설명"
  width={800}
  height={400}
  className="my-4"
/>;
```

## 6. 코드 (Code)

### 인라인 코드

```markdown
`인라인 코드`
```

### 코드 블록

````markdown
```
기본 코드 블록
```

```javascript
// 언어 지정 코드 블록
function hello() {
  console.log("Hello, World!");
}
```

```python
# Python 코드 예시
def hello():
    print("Hello, World!")
```
````

## 7. 인용문 (Blockquotes)

```markdown
> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.

> 중첩된 인용문
>
> > 더 깊은 인용문

> **📋 중요사항**
>
> 특별한 스타일의 인용문도 만들 수 있습니다.
```

> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.

> **📋 중요사항**
>
> 특별한 스타일의 인용문도 만들 수 있습니다.

## 8. 표 (Tables)

```markdown
| 헤더 1   | 헤더 2   | 헤더 3   |
| -------- | -------- | -------- |
| 데이터 1 | 데이터 2 | 데이터 3 |
| 데이터 4 | 데이터 5 | 데이터 6 |

<!-- 정렬 -->

| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |
| :-------- | :---------: | ----------: |
| 텍스트    |   텍스트    |      텍스트 |
```

## 9. 구분선 (Horizontal Rules)

```markdown
---

---

---
```

---

## 10. 체크박스 (Task Lists)

```markdown
- [x] 완료된 작업
- [ ] 미완료 작업
- [x] 또 다른 완료된 작업
```

- [x] 완료된 작업
- [ ] 미완료 작업
- [x] 또 다른 완료된 작업

## 11. 이스케이프 문자

특수 문자를 그대로 표시하려면 백슬래시(`\`)를 사용:

```markdown
\* 별표를 그대로 표시
\# 해시를 그대로 표시
\[대괄호를 그대로 표시\]
```

## 12. 수학 공식 (LaTeX)

```markdown
인라인 수식: $E = mc^2$

블록 수식:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

인라인 수식: $E = mc^2$

블록 수식:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 13. HTML 태그 사용

마크다운에서는 HTML 태그도 직접 사용 가능:

```html
<details>
  <summary>클릭하여 펼치기</summary>
  숨겨진 내용입니다.
</details>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>하이라이트된 텍스트</mark>
```

## 14. MDX 특화 기능

### JSX 컴포넌트 사용

```jsx
import CustomComponent from './CustomComponent';

<CustomComponent prop="value" />

<div className="custom-class">
  마크다운과 JSX를 함께 사용
</div>
```

### 컴포넌트에 마크다운 전달

```jsx
<CustomWrapper>
  # 이것은 마크다운입니다 **굵은 텍스트**와 함께 사용할 수 있습니다.
</CustomWrapper>
```

## 15. 특수 인용문 스타일 예시

```markdown
> **💡 팁**
>
> 유용한 팁을 제공할 때 사용합니다.

> **⚠️ 주의사항**
>
> 중요한 주의사항을 알릴 때 사용합니다.

> **📋 참고사항**
>
> 추가 정보를 제공할 때 사용합니다.

> **🚨 경고**
>
> 심각한 경고나 오류에 대해 알릴 때 사용합니다.
```

## 16. 코드 하이라이팅 언어 목록

자주 사용되는 언어 태그들:

- `javascript` 또는 `js`
- `typescript` 또는 `ts`
- `python` 또는 `py`
- `java`
- `cpp` 또는 `c++`
- `csharp` 또는 `c#`
- `html`
- `css`
- `scss` 또는 `sass`
- `json`
- `yaml` 또는 `yml`
- `markdown` 또는 `md`
- `bash` 또는 `shell`
- `sql`
- `r`
- `go`
- `rust`
- `php`

## 사용 팁

1. **일관성 유지**: 프로젝트 전체에서 동일한 스타일을 사용하세요.
2. **가독성 우선**: 복잡한 HTML보다는 마크다운 문법을 우선 사용하세요.
3. **미리보기 활용**: 작성 중에 미리보기를 통해 결과를 확인하세요.
4. **공백 활용**: 요소 간에 적절한 공백을 두어 가독성을 높이세요.
