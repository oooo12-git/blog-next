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

  // IndexNow API들 - 각각 다른 키 사용
  const apis = [
    {
      name: "IndexNow.org",
      url: "https://api.indexnow.org/IndexNow",
      key: "5f6934c83f654c05bcaeeb7b32822e0c",
      keyLocation:
        "https://www.kimjaahyun.com/5f6934c83f654c05bcaeeb7b32822e0c.txt",
    },
    {
      name: "네이버 서치 어드바이저",
      url: "https://searchadvisor.naver.com/indexnow",
      key: "c2c8551fbe854b5c8f0894c5d419a1ce",
      keyLocation:
        "https://www.kimjaahyun.com/c2c8551fbe854b5c8f0894c5d419a1ce.txt",
    },
  ];

  let allSuccess = true;

  for (const api of apis) {
    console.log(`🔄 ${api.name} API 호출 중...`);
    const startTime = Date.now();

    try {
      const response = await fetch(api.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host: "www.kimjaahyun.com",
          key: api.key,
          keyLocation: api.keyLocation,
          urlList: urls,
        }),
      });

      const duration = (Date.now() - startTime) / 1000;
      const responseText = await response.text();

      console.log(`📈 ${api.name} 응답 결과:`);
      console.log(`⏱️  응답 시간: ${duration}초`);
      console.log(`🔢 HTTP 상태 코드: ${response.status}`);
      console.log(`📄 응답 내용: ${responseText || "(빈 응답)"}`);

      if (response.ok) {
        console.log(`✅ ${api.name}: URL이 정상적으로 제출되었습니다.`);
      } else {
        console.log(`❌ ${api.name} 오류: HTTP ${response.status}`);
        allSuccess = false;
      }
    } catch (error) {
      console.log(`❌ ${api.name} 네트워크 오류:`, error.message);
      allSuccess = false;
    }
    console.log("==========================");
  }

  if (allSuccess) {
    console.log("✅ 모든 API에 성공적으로 제출되었습니다.");
  } else {
    console.log("⚠️  일부 API에서 오류가 발생했지만 빌드를 계속 진행합니다.");
  }

  process.exit(0);
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
