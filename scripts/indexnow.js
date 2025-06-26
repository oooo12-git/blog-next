const fs = require("fs");
const path = require("path");

async function submitToIndexNow() {
  console.log("🚀 IndexNow API 호출 시작...");
  console.log("==========================");
  console.log("📅 실행 시간:", new Date().toISOString());
  console.log("🌐 호스트: www.kimjaahyun.com");

  // 현재 작업 디렉토리 확인
  console.log("📂 현재 작업 디렉토리:", process.cwd());

  // 기본 URL들
  const urls = [
    "https://www.kimjaahyun.com",
    "https://www.kimjaahyun.com/ko",
    "https://www.kimjaahyun.com/en",
    "https://www.kimjaahyun.com/ko/blog",
    "https://www.kimjaahyun.com/en/blog",
    "https://www.kimjaahyun.com/ko/about",
    "https://www.kimjaahyun.com/en/about",
    "https://www.kimjaahyun.com/ko/stat",
    "https://www.kimjaahyun.com/en/stat",
  ];

  // contents 폴더에서 블로그 포스트 URL 추가
  const contentsDir = path.join(process.cwd(), "contents");
  console.log("📁 contents 디렉토리 경로:", contentsDir);
  console.log("📁 contents 폴더 존재 여부:", fs.existsSync(contentsDir));

  if (fs.existsSync(contentsDir)) {
    console.log("📁 contents 폴더에서 블로그 포스트 검색 중...");

    try {
      const dirContents = fs.readdirSync(contentsDir, { withFileTypes: true });
      console.log(
        "📁 contents 폴더 내용:",
        dirContents.map(
          (d) => `${d.name} (${d.isDirectory() ? "dir" : "file"})`
        )
      );

      const folders = dirContents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      console.log("📁 발견된 디렉토리들:", folders);

      folders.forEach((folder) => {
        urls.push(`https://www.kimjaahyun.com/ko/blog/${folder}`);
        urls.push(`https://www.kimjaahyun.com/en/blog/${folder}`);
        console.log(`  ✓ 발견: ${folder}`);
      });
    } catch (error) {
      console.error("❌ contents 폴더 읽기 오류:", error.message);
    }
  } else {
    console.log("⚠️  contents 폴더를 찾을 수 없습니다!");
    console.log("📂 현재 디렉토리의 파일/폴더 목록:");
    try {
      const currentDirContents = fs.readdirSync(process.cwd());
      currentDirContents.forEach((item) => {
        const itemPath = path.join(process.cwd(), item);
        const isDir = fs.statSync(itemPath).isDirectory();
        console.log(`  ${isDir ? "📁" : "📄"} ${item}`);
      });
    } catch (error) {
      console.error("❌ 현재 디렉토리 읽기 오류:", error.message);
    }
  }

  console.log(`📊 제출할 URL 개수: ${urls.length}`);
  console.log("📝 제출할 URL 목록:");
  urls.forEach((url) => console.log(`  - ${url}`));
  console.log("==========================");

  // IndexNow API 엔드포인트들
  const indexNowEndpoints = [
    {
      name: "Microsoft Bing/Yandex",
      url: "https://api.indexnow.org/IndexNow",
      icon: "🔍",
    },
    // {
    //   name: "Naver SearchAdvisor",
    //   url: "https://searchadvisor.naver.com/indexnow",
    //   icon: "🟢",
    // },
  ];

  const payload = {
    host: "www.kimjaahyun.com",
    key: "6d3dbbf1d8c943db80232680a04088c8",
    keyLocation:
      "https://www.kimjaahyun.com/6d3dbbf1d8c943db80232680a04088c8.txt",
    urlList: urls,
  };

  console.log("🔄 IndexNow API 호출 중...");

  // 모든 엔드포인트에 병렬로 요청 보내기
  const promises = indexNowEndpoints.map(async (endpoint) => {
    const startTime = Date.now();
    console.log(`${endpoint.icon} ${endpoint.name} 호출 중...`);

    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const duration = (Date.now() - startTime) / 1000;
      const responseText = await response.text();

      return {
        endpoint: endpoint.name,
        icon: endpoint.icon,
        success: response.ok,
        status: response.status,
        duration: duration,
        response: responseText,
      };
    } catch (error) {
      return {
        endpoint: endpoint.name,
        icon: endpoint.icon,
        success: false,
        status: "ERROR",
        duration: (Date.now() - startTime) / 1000,
        error: error.message,
      };
    }
  });

  // 모든 요청 완료 대기
  const results = await Promise.allSettled(promises);

  console.log("==========================");
  console.log("📈 API 응답 결과:");

  let hasError = false;

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const data = result.value;
      console.log(`${data.icon} ${data.endpoint}:`);
      console.log(`  ⏱️  응답 시간: ${data.duration}초`);
      console.log(`  🔢 HTTP 상태 코드: ${data.status}`);

      if (data.success) {
        console.log(`  ✅ 성공: URL이 정상적으로 제출되었습니다.`);
        console.log(`  📄 응답: ${data.response || "(빈 응답)"}`);
      } else {
        console.log(`  ❌ 실패: HTTP ${data.status}`);
        console.log(`  📄 응답: ${data.response || data.error || "(빈 응답)"}`);
        hasError = true;
      }
      console.log("");
    } else {
      console.log(`❌ 요청 처리 중 오류: ${result.reason}`);
      hasError = true;
    }
  });

  // 최종 결과
  if (hasError) {
    console.log("⚠️  일부 API 호출에서 오류가 발생했습니다.");
    process.exit(1);
  } else {
    console.log("✅ 모든 IndexNow API 호출이 성공했습니다!");
    process.exit(0);
  }
}

// 프로덕션 환경에서만 실행
if (
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production"
) {
  submitToIndexNow();
} else {
  console.log("🚫 프로덕션 환경이 아니므로 IndexNow API 호출을 건너뜁니다.");
}
