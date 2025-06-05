export default function AboutPage() {
  return (
    <div className="px-4 my-2 sm:px-4 dark:text-white">
      <h2 className="text-2xl font-bold">안녕하세요 개발자 김재현입니다</h2>
      <ul className="my-2 ml-4 list-disc list-inside">
        <li>
          <p className="inline">서강대학교 기계공학/ 경영학 졸업</p>
        </li>
        <li>
          <p className="inline">디지털 마케팅 경력 3년</p>
        </li>
        <li>
          <p className="inline">
            서울대학교 빅데이터 핀테크 AI 전문가 과정 이수
          </p>
        </li>
        <li>
          <p className="inline">Nextjs, React, Python, LangGraph, SQL</p>
        </li>
        <li>
          <p className="inline">재무위험관리사, SQLD, ADsP, AICE associate</p>
        </li>
      </ul>
    </div>
  );
}
