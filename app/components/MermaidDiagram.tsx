"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

// React 요소에서 텍스트를 추출하는 함수
function extractTextFromNode(node: any): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");
  if (node && typeof node === "object" && node.props && node.props.children) {
    return extractTextFromNode(node.props.children);
  }
  return "";
}

export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let mermaidLoaded = false;

    const loadMermaid = async () => {
      if (mermaidLoaded) return;

      try {
        // chart가 문자열이 아닌 경우 텍스트 추출
        let chartText: string;
        if (typeof chart === "string") {
          chartText = chart;
        } else {
          chartText = extractTextFromNode(chart);
        }

        // 빈 문자열이나 유효하지 않은 chart인 경우 처리
        if (
          !chartText ||
          typeof chartText !== "string" ||
          chartText.trim() === ""
        ) {
          if (elementRef.current) {
            elementRef.current.innerHTML = `
              <div class="p-4 border border-yellow-300 bg-yellow-50 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
                <p class="text-yellow-700 dark:text-yellow-300 font-semibold">Mermaid 다이어그램 오류</p>
                <p class="text-sm mt-2 text-yellow-600 dark:text-yellow-400">차트 데이터가 유효하지 않습니다.</p>
              </div>
            `;
          }
          return;
        }

        // 동적으로 mermaid를 import
        const mermaid = (await import("mermaid")).default;

        // 테마 설정
        const isDark = theme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: {
            primaryColor: isDark ? "#60a5fa" : "#3b82f6",
            primaryTextColor: isDark ? "#ffffff" : "#000000",
            primaryBorderColor: isDark ? "#374151" : "#d1d5db",
            lineColor: isDark ? "#6b7280" : "#374151",
            sectionBkgColor: isDark ? "#1f2937" : "#f9fafb",
            altSectionBkgColor: isDark ? "#374151" : "#f3f4f6",
            gridColor: isDark ? "#4b5563" : "#e5e7eb",
            c0: isDark ? "#1f2937" : "#ffffff",
            c1: isDark ? "#374151" : "#f9fafb",
            c2: isDark ? "#4b5563" : "#f3f4f6",
            c3: isDark ? "#6b7280" : "#e5e7eb",
          },
        });

        if (elementRef.current) {
          const uniqueId =
            id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;

          // 기존 내용 제거
          elementRef.current.innerHTML = "";

          try {
            const { svg } = await mermaid.render(uniqueId, chartText);
            elementRef.current.innerHTML = svg;
          } catch (error) {
            console.error("Mermaid rendering error:", error);
            elementRef.current.innerHTML = `
              <div class="p-4 border border-red-300 bg-red-50 rounded-lg dark:bg-red-900 dark:border-red-700">
                <p class="text-red-700 dark:text-red-300 font-semibold">Mermaid 다이어그램 렌더링 오류</p>
                <pre class="text-sm mt-2 text-red-600 dark:text-red-400">${error}</pre>
              </div>
            `;
          }
        }

        mermaidLoaded = true;
      } catch (error) {
        console.error("Failed to load mermaid:", error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `
            <div class="p-4 border border-yellow-300 bg-yellow-50 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
              <p class="text-yellow-700 dark:text-yellow-300 font-semibold">Mermaid 라이브러리를 로드할 수 없습니다</p>
              <p class="text-sm mt-2 text-yellow-600 dark:text-yellow-400">yarn add mermaid 명령어로 mermaid 패키지를 설치해주세요.</p>
            </div>
          `;
        }
      }
    };

    loadMermaid();
  }, [chart, theme, id]);

  return (
    <div className="my-6">
      <div
        ref={elementRef}
        className="flex justify-center items-center min-h-[200px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      />
    </div>
  );
}
