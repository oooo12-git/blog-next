"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Visitors() {
  const tFooter = useTranslations("footer");
  const [visitors, setVisitors] = useState({ today: 0, total: 0 });

  useEffect(() => {
    const updateVisitors = async () => {
      try {
        // 방문자 수를 증가시키는 API 호출
        await fetch("/api/visitors", { method: "POST" });

        // 최신 방문자 수를 조회하는 API 호출
        const response = await fetch("/api/visitors");
        const data = await response.json();
        // 상태 업데이트
        setVisitors(data);
      } catch (error) {
        // 에러 발생 시 콘솔에 로그 출력
        console.error("Failed to update visitors:", error);
      }
    };

    // 방문자 수 업데이트 함수 실행
    updateVisitors();
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="flex flex-row space-x-3 sm:space-x-8">
      <div>
        {tFooter("total")}: {visitors.total}
      </div>
      <div>
        {tFooter("today")}: {visitors.today}
      </div>
    </div>
  );
}
