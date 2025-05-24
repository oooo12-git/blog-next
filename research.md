`npm install gray-matter markdown-to-jsx`

- gray-matter : gray-matter는 마크다운 파일의 front matter를 파싱하는 JavaScript 라이브러리
  - 참고 front matter를 어떤 object로 바꾸는가 [링크](https://nextjs.org/docs/app/guides/mdx#frontmatter)
- markdown-to-jsx : 마크다운 텍스트를 React 컴포넌트로 변환해주는 라이브러리
- @next/mdx : nextjs에서 공식 지원하는 마크다운 처리 라이브러리 [링크](https://nextjs.org/docs/app/guides/mdx)
  - mdx : 마크다운 파일 안에 React 컴포넌트를 직접 삽입 가능
  - next-mdx-remote 에서도 frontmatter 사용할 경우 gray-matter 사용 가능하다고 함 [링크](https://nextjs.org/docs/app/guides/mdx#frontmatter)
