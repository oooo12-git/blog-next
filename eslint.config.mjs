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
  {
    // Next 16 업그레이드로 새로 활성화된 react-hooks 규칙
    // 기존 코드 대응 전까지 warn으로 운영, 점진적 수정 예정
    rules: {
      "react-hooks/error-boundaries": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
