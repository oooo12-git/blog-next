"use server"; // 클라이언트에서 함수 호출 시마다 서버에서 실행(서버 액션)
// 'use server' 없다면, 브라우저에서 직접 Supabase 호출 -> API 키가 클라이언트에 노출됨
//1. 클라이언트: incrementViewCount(slug, locale) 호출
// 2. Next.js: POST 요청으로 변환하여 서버에 전송
// 3. 서버: 'use server' 함수 실행
// 4. 서버: Supabase 호출 (API 키 안전)
// 5. 서버: 결과 반환
// 6. 클라이언트: 결과 받아서 UI 업데이트

import {
  incrementPostViewCount,
  togglePostLike,
  getPostLikeCount,
  getUserLikeStatus,
} from "./utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function incrementViewCount(slug: string, locale: string) {
  try {
    // 1. 데이터베이스에서 조회수 증가
    const newCount = await incrementPostViewCount(slug);

    // 2. 해당 페이지의 캐시를 무효화
    revalidatePath(`/${locale}/blog/${slug}`);
    //    → 다음에 이 페이지를 요청하면 새로운 조회수로 페이지를 재생성

    return { success: true, viewCount: newCount };
  } catch (error) {
    console.error("Error in incrementViewCount action:", error);
    return { success: false, error: "Failed to increment view count" };
  }
}

// 사용자 세션 ID 생성 함수
async function generateUserSession(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const userAgent = headersList.get("user-agent") || "";

  // IP 주소 추출
  const ip = forwarded ? forwarded.split(",")[0] : realIp || "unknown";

  // IP + User-Agent의 해시를 사용하여 세션 ID 생성
  const sessionString = `${ip}-${userAgent}`;

  // 간단한 해시 함수 (실제 운영에서는 crypto.createHash 사용 권장)
  let hash = 0;
  for (let i = 0; i < sessionString.length; i++) {
    const char = sessionString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32비트 정수로 변환
  }

  return `session_${Math.abs(hash)}`;
}

// 좋아요 토글 Server Action
export async function toggleLike(slug: string, locale: string) {
  try {
    // 사용자 세션 ID 생성
    const userSession = await generateUserSession();

    // 좋아요 상태 토글
    const result = await togglePostLike(slug, userSession);

    if (result.success) {
      // 해당 페이지의 캐시를 무효화
      revalidatePath(`/${locale}/blog/${slug}`);

      return {
        success: true,
        liked: result.liked,
        likeCount: result.likeCount,
      };
    } else {
      return { success: false, error: "Failed to toggle like" };
    }
  } catch (error) {
    console.error("Error in toggleLike action:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// 좋아요 상태 가져오기 Server Action
export async function getLikeStatus(slug: string) {
  try {
    const userSession = await generateUserSession();

    const [likeCount, isLiked] = await Promise.all([
      getPostLikeCount(slug),
      getUserLikeStatus(slug, userSession),
    ]);

    return {
      success: true,
      likeCount,
      isLiked,
    } as const;
  } catch (error) {
    console.error("Error in getLikeStatus action:", error);
    return { success: false, likeCount: 0, isLiked: false } as const;
  }
}
