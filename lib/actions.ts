"use server"; // 클라이언트에서 함수 호출 시마다 서버에서 실행(서버 액션)
// 'use server' 없다면, 브라우저에서 직접 Supabase 호출 -> API 키가 클라이언트에 노출됨
//1. 클라이언트: incrementViewCount(slug, locale) 호출
// 2. Next.js: POST 요청으로 변환하여 서버에 전송
// 3. 서버: 'use server' 함수 실행
// 4. 서버: Supabase 호출 (API 키 안전)
// 5. 서버: 결과 반환
// 6. 클라이언트: 결과 받아서 UI 업데이트

import { incrementPostViewCount } from "./utils";
import { revalidatePath } from "next/cache";

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
