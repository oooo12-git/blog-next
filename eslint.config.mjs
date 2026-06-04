import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // next lint 시절 대상에서 제외되던 Node 스크립트/생성물/임시 디렉터리
    ignores: [
      ".next/**",
      "node_modules/**",
      "scripts/**",
      ".gemini/**",
      ".cursor/**",
      ".naver_contents/**",
      "temp/**",
      "contents_template/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
