var { google } = require("googleapis");
var fs = require("fs");
var path = require("path");

async function runIndexingAPI() {
  try {
    console.log("🚀 Google Indexing API 스크립트 시작...");

    // 환경 변수에서 서비스 계정 키 가져오기
    let serviceAccountKey;

    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      // Vercel 환경에서는 환경 변수 사용
      serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      console.log("✅ 환경 변수에서 서비스 계정 키 로드 완료");
    } else {
      // 로컬 개발에서는 파일 사용 (fallback)
      const keyFilePath = path.join(
        __dirname,
        "indexing-api-kimjaahyun-blog-7ac7e0285a7c.json"
      );

      if (!fs.existsSync(keyFilePath)) {
        console.error("❌ 환경 변수도 없고 로컬 키 파일도 찾을 수 없습니다");
        console.error("GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수를 설정하거나");
        console.error("로컬 키 파일을 추가해주세요:", keyFilePath);
        return;
      }

      serviceAccountKey = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
      console.log("✅ 로컬 파일에서 서비스 계정 키 로드 완료");
    }

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

    console.log(
      `📡 총 ${urls.length}개 URL을 Google Indexing API에 전송합니다.`
    );

    // Google Auth 설정 (credentials 객체 직접 사용)
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    // 인증 클라이언트 가져오기
    const authClient = await auth.getClient();

    console.log("✅ JWT 인증 성공");

    // Indexing API 클라이언트 초기화
    const indexing = google.indexing({ version: "v3", auth: authClient });

    // batch 요청 생성
    const batch = [];

    urls.forEach((url, index) => {
      batch.push({
        url: url,
        type: "URL_UPDATED",
      });
    });

    console.log("🚀 Batch 요청 시작...");

    // 병렬로 요청 처리 (Google API는 초당 200 요청 제한이 있으므로 적절히 제한)
    const batchSize = 10; // 한 번에 처리할 요청 수
    const delay = 100; // 요청 간 딜레이 (ms)

    let totalSuccess = 0;
    let totalFailed = 0;

    for (let i = 0; i < batch.length; i += batchSize) {
      const currentBatch = batch.slice(i, i + batchSize);

      console.log(
        `📦 배치 ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          batch.length / batchSize
        )} 처리 중... (${currentBatch.length}개 URL)`
      );

      const promises = currentBatch.map(async (item) => {
        try {
          const response = await indexing.urlNotifications.publish({
            requestBody: {
              url: item.url,
              type: item.type,
            },
          });

          console.log(`  ✅ 성공: ${item.url}`);
          console.log(`     🔢 HTTP 상태: ${response.status}`);
          console.log(
            `     📋 응답 헤더: ${JSON.stringify(
              response.headers || {},
              null,
              2
            )}`
          );
          if (response.data && Object.keys(response.data).length > 0) {
            console.log(
              `     📄 응답 데이터: ${JSON.stringify(response.data)}`
            );
          } else {
            console.log(`     📄 응답 데이터: 빈 응답 (정상)`);
          }
          return {
            success: true,
            url: item.url,
            status: response.status,
            headers: response.headers,
            response: response.data,
          };
        } catch (error) {
          console.error(`  ❌ 실패: ${item.url} - ${error.message}`);
          if (error.response) {
            console.error(`     🔢 HTTP 상태: ${error.response.status}`);
            console.error(
              `     📄 에러 응답: ${JSON.stringify(error.response.data || {})}`
            );
          }
          return {
            success: false,
            url: item.url,
            error: error.message,
            status: error.response?.status,
            errorData: error.response?.data,
          };
        }
      });

      const results = await Promise.all(promises);

      // 결과 요약
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      totalSuccess += successful;
      totalFailed += failed;

      console.log(`  📊 배치 결과: 성공 ${successful}개, 실패 ${failed}개`);

      // HTTP 상태 코드별 통계
      if (successful > 0) {
        const statusCounts = {};
        results
          .filter((r) => r.success)
          .forEach((result) => {
            const status = result.status || "unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
          });
        console.log(
          `  📈 HTTP 상태 통계:`,
          Object.entries(statusCounts)
            .map(([status, count]) => `${status}: ${count}개`)
            .join(", ")
        );
      }

      if (failed > 0) {
        const errorStatusCounts = {};
        results
          .filter((r) => !r.success)
          .forEach((result) => {
            const status = result.status || "network_error";
            errorStatusCounts[status] = (errorStatusCounts[status] || 0) + 1;
          });
        console.log(
          `  ❌ 에러 상태 통계:`,
          Object.entries(errorStatusCounts)
            .map(([status, count]) => `${status}: ${count}개`)
            .join(", ")
        );
      }

      // 다음 배치 전 잠시 대기
      if (i + batchSize < batch.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.log(
      `🎉 Google Indexing API 완료! 총 성공: ${totalSuccess}개, 실패: ${totalFailed}개`
    );

    console.log("📊 최종 요약:");
    console.log(`  • 전체 URL: ${urls.length}개`);
    console.log(`  • 성공: ${totalSuccess}개`);
    console.log(`  • 실패: ${totalFailed}개`);
    console.log(
      `  • 성공률: ${
        totalSuccess > 0 ? ((totalSuccess / urls.length) * 100).toFixed(1) : 0
      }%`
    );

    if (totalSuccess > 0) {
      console.log("✅ Google에 성공적으로 인덱싱 요청이 전송되었습니다!");
      console.log(
        "   인덱싱이 완료되는 데 몇 분에서 몇 시간이 걸릴 수 있습니다."
      );
    }
  } catch (error) {
    console.error(
      "❌ Google Indexing API 스크립트 실행 중 오류:",
      error.message
    );
    console.log("⚠️  Indexing API 오류가 발생했지만 빌드는 계속 진행됩니다.");
  }
}

// 프로덕션 환경에서만 실행
const isProduction =
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("🚀 프로덕션 환경에서 Google Indexing API를 실행합니다.");
  runIndexingAPI()
    .then(() => {
      console.log("✅ Google Indexing API 스크립트 종료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ 스크립트 실행 실패:", error.message);
      console.log("⚠️  오류가 발생했지만 빌드 프로세스는 계속 진행됩니다.");
      process.exit(0); // 에러가 있어도 성공으로 종료
    });
} else {
  console.log(
    "🚫 프로덕션 환경이 아니므로 Google Indexing API 호출을 건너뜁니다."
  );
}
