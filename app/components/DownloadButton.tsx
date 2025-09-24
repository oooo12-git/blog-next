"use client";

import { useState, useEffect, useTransition } from "react";
import { getDownloadCount, incrementDownloadCount } from "@/lib/actions";

interface DownloadButtonProps {
  slug: string;
  pdfUrl: string;
  fileName: string;
}

export default function DownloadButton({
  slug,
  pdfUrl,
  fileName,
}: DownloadButtonProps) {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDownloadCount = async () => {
      const result = await getDownloadCount(slug);
      if (result.success) {
        setDownloadCount(result.downloadCount);
      }
    };
    fetchDownloadCount();
  }, [slug]);

  const handleDownload = () => {
    startTransition(async () => {
      // 1. 낙관적 업데이트: 즉시 다운로드 수 증가
      const currentCount = downloadCount ?? 0;
      setDownloadCount(currentCount + 1);

      // 2. 다운로드 실행
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 3. 서버 업데이트
      const result = await incrementDownloadCount(slug);
      if (result.success) {
        // 4. 성공 시 서버 결과로 동기화
        setDownloadCount(result.downloadCount ?? 0);
      } else {
        // 5. 실패 시 롤백
        setDownloadCount(currentCount);
        console.error("Failed to increment download count:", result.error);
      }
    });
  };

  return (
    <div className="my-4 text-center">
      <button
        onClick={handleDownload}
        disabled={isPending}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:bg-gray-400"
      >
        {isPending ? "처리 중..." : "PDF 다운로드"}
      </button>
      <p className="text-sm text-gray-500 mt-2">
        다운로드 횟수:{" "}
        {downloadCount !== null ? downloadCount : "불러오는 중..."}
      </p>
    </div>
  );
}
