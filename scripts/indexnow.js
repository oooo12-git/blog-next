const fs = require("fs");
const path = require("path");

async function submitToIndexNow() {
  console.log("🚀 IndexNow API 호출 시작...");
  console.log("==========================");
  console.log("📅 실행 시간:", new Date().toISOString());
  console.log("🌐 호스트: www.kimjaahyun.com");

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
  if (fs.existsSync(contentsDir)) {
    console.log("📁 contents 폴더에서 블로그 포스트 검색 중...");
    const folders = fs
      .readdirSync(contentsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    folders.forEach((folder) => {
      urls.push(`https://www.kimjaahyun.com/ko/blog/${folder}`);
      urls.push(`https://www.kimjaahyun.com/en/blog/${folder}`);
      console.log(`  ✓ 발견: ${folder}`);
    });
  }

  console.log(`📊 제출할 URL 개수: ${urls.length}`);
  console.log("📝 제출할 URL 목록:");
  urls.forEach((url) => console.log(`  - ${url}`));
  console.log("==========================");

  const startTime = Date.now();
  console.log("🔄 IndexNow API 호출 중...");

  try {
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "www.kimjaahyun.com",
        key: "6d3dbbf1d8c943db80232680a04088c8",
        keyLocation:
          "https://www.kimjaahyun.com/6d3dbbf1d8c943db80232680a04088c8.txt",
        urlList: urls,
      }),
    });

    const duration = (Date.now() - startTime) / 1000;
    const responseText = await response.text();

    console.log("==========================");
    console.log("📈 API 응답 결과:");
    console.log(`⏱️  응답 시간: ${duration}초`);
    console.log(`🔢 HTTP 상태 코드: ${response.status}`);
    console.log(`📄 응답 내용: ${responseText || "(빈 응답)"}`);

    if (response.ok) {
      console.log("✅ 성공: URL이 정상적으로 제출되었습니다.");
      process.exit(0);
    } else {
      console.log(`❌ 오류: HTTP ${response.status}`);
      console.log("⚠️  IndexNow API 오류가 발생했지만 빌드를 계속 진행합니다.");
      process.exit(0);
    }
  } catch (error) {
    console.log("❌ 네트워크 오류:", error.message);
    console.log("⚠️  IndexNow API 오류가 발생했지만 빌드를 계속 진행합니다.");
    process.exit(0);
  }
}

// 프로덕션 환경에서만 실행
const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("🚀 프로덕션 환경에서 실행됩니다.");
  submitToIndexNow();
} else {
  console.log("🚫 프로덕션 환경이 아니므로 IndexNow API 호출을 건너뜁니다.");
}
