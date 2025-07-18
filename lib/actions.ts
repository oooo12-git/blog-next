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
  getCommentsBySlug,
  addComment,
  updateComment,
  deleteComment,
  getCommentById,
  getPostDownloadCount,
  incrementPostDownloadCount,
} from "./utils";
import { CommentFormData } from "./types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// 입력값 검증 및 보안 함수들
function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== "string") return "";

  // 기본 문자열 정리
  let sanitized = input.trim();

  // 길이 제한
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // 위험한 HTML 태그 제거 (기본적인 XSS 방어)
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  return sanitized;
}

function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

function validateCommentData(data: CommentFormData): {
  valid: boolean;
  error?: string;
} {
  // 작성자 이름 검증
  if (!data.author || typeof data.author !== "string") {
    return { valid: false, error: "작성자 이름을 입력해주세요." };
  }

  const sanitizedAuthor = sanitizeString(data.author, 50);
  if (sanitizedAuthor.length < 1) {
    return { valid: false, error: "작성자 이름을 입력해주세요." };
  }

  // 이메일 검증
  if (!validateEmail(data.email)) {
    return { valid: false, error: "올바른 이메일 주소를 입력해주세요." };
  }

  // 댓글 내용 검증
  if (!data.content || typeof data.content !== "string") {
    return { valid: false, error: "댓글 내용을 입력해주세요." };
  }

  const sanitizedContent = sanitizeString(data.content, 2000);
  if (sanitizedContent.length < 1) {
    return { valid: false, error: "댓글 내용을 입력해주세요." };
  }

  return { valid: true };
}

function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;

  // slug는 영문, 숫자, 하이픈만 허용
  const slugRegex = /^[a-zA-Z0-9-_]+$/;
  return slugRegex.test(slug) && slug.length <= 100;
}

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

// ==================== 댓글 관련 Server Actions ====================

// 댓글 목록 가져오기 Server Action
export async function getComments(slug: string) {
  try {
    const comments = await getCommentsBySlug(slug);
    return { success: true, comments };
  } catch (error) {
    console.error("Error in getComments action:", error);
    return {
      success: false,
      comments: [],
      error: "댓글을 불러올 수 없습니다.",
    };
  }
}

// 댓글 추가 Server Action
export async function createComment(
  slug: string,
  locale: string,
  data: CommentFormData,
  parentId?: string
) {
  try {
    // 입력값 검증
    if (!validateSlug(slug)) {
      return { success: false, error: "잘못된 페이지 식별자입니다." };
    }

    const validation = validateCommentData(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 입력값 정리
    const sanitizedData: CommentFormData = {
      author: sanitizeString(data.author, 50),
      email: data.email.trim().toLowerCase(),
      content: sanitizeString(data.content, 2000),
    };

    const result = await addComment(slug, sanitizedData, parentId);

    if (result.success) {
      // 현재 환경에 따라 기본 URL 설정
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? `http://localhost:${process.env.PORT || 3000}`
          : "https://www.kimjaahyun.com";

      const pageUrl = `${baseUrl}/${locale}/blog/${slug}`;

      // 답글인 경우와 새 댓글인 경우를 구분하여 이메일 발송
      if (parentId && result.comment) {
        // 답글인 경우: 원 댓글 작성자에게 알림 발송
        try {
          // 원 댓글 정보 조회
          const parentComment = await getCommentById(parentId);

          if (parentComment && parentComment.email !== sanitizedData.email) {
            // 자신에게 답글을 다는 경우가 아닐 때만 알림 발송
            const replyApiUrl = `${baseUrl}/api/email/reply-notification`;

            console.log("답글 알림 발송 시도:", { replyApiUrl, pageUrl });

            const replyResponse = await fetch(replyApiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                replyContent: sanitizedData.content,
                replyAuthor: sanitizedData.author,
                originalCommentContent: parentComment.content,
                originalCommentAuthor: parentComment.author,
                originalCommentEmail: parentComment.email,
                postSlug: slug,
                pageUrl: pageUrl,
              }),
            });

            if (!replyResponse.ok) {
              throw new Error(
                `답글 알림 API 호출 실패: ${replyResponse.status} ${replyResponse.statusText}`
              );
            }

            const replyEmailResult = await replyResponse.json();
            console.log("답글 알림 결과:", replyEmailResult);
          }
        } catch (replyEmailError) {
          console.error("답글 알림 발송 실패:", replyEmailError);
          // 답글 알림 발송 실패해도 댓글 등록은 성공으로 처리
        }
      } else {
        // 새 댓글인 경우: 관리자에게 알림 발송
        try {
          const apiUrl = `${baseUrl}/api/email/comment-notification`;

          console.log("이메일 알림 발송 시도:", { apiUrl, pageUrl });

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentContent: sanitizedData.content,
              commentAuthor: sanitizedData.author,
              postSlug: slug,
              pageUrl: pageUrl,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `이메일 API 호출 실패: ${response.status} ${response.statusText}`
            );
          }

          const emailResult = await response.json();
          console.log("이메일 알림 결과:", emailResult);
        } catch (emailError) {
          console.error("이메일 알림 발송 실패:", emailError);
          // 이메일 발송 실패해도 댓글 등록은 성공으로 처리
        }
      }

      // 해당 페이지의 캐시를 무효화
      revalidatePath(`/${locale}/blog/${slug}`);
      return { success: true, comment: result.comment };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error in createComment action:", error);
    return { success: false, error: "댓글 추가에 실패했습니다." };
  }
}

// 댓글 수정 Server Action
export async function editComment(
  commentId: string,
  email: string,
  data: CommentFormData,
  slug: string,
  locale: string
) {
  try {
    // 입력값 검증
    if (!validateSlug(slug)) {
      return { success: false, error: "잘못된 페이지 식별자입니다." };
    }

    if (!validateEmail(email)) {
      return { success: false, error: "올바른 이메일 주소를 입력해주세요." };
    }

    const validation = validateCommentData(data);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 입력값 정리
    const sanitizedData: CommentFormData = {
      author: sanitizeString(data.author, 50),
      email: data.email.trim().toLowerCase(),
      content: sanitizeString(data.content, 2000),
    };

    const result = await updateComment(
      commentId,
      email.trim().toLowerCase(),
      sanitizedData
    );

    if (result.success) {
      // 해당 페이지의 캐시를 무효화
      revalidatePath(`/${locale}/blog/${slug}`);
      return { success: true, comment: result.comment };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error in editComment action:", error);
    return { success: false, error: "댓글 수정에 실패했습니다." };
  }
}

// 댓글 삭제 Server Action
export async function removeComment(
  commentId: string,
  email: string,
  slug: string,
  locale: string
) {
  try {
    // 입력값 검증
    if (!validateSlug(slug)) {
      return { success: false, error: "잘못된 페이지 식별자입니다." };
    }

    if (!validateEmail(email)) {
      return { success: false, error: "올바른 이메일 주소를 입력해주세요." };
    }

    const result = await deleteComment(commentId, email.trim().toLowerCase());

    if (result.success) {
      // 해당 페이지의 캐시를 무효화
      revalidatePath(`/${locale}/blog/${slug}`);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error in removeComment action:", error);
    return { success: false, error: "댓글 삭제에 실패했습니다." };
  }
}

// ==================== 다운로드 관련 Server Actions ====================

export async function getDownloadCount(slug: string) {
  try {
    if (!validateSlug(slug)) {
      return { success: false, downloadCount: 0 };
    }
    const downloadCount = await getPostDownloadCount(slug);
    return { success: true, downloadCount };
  } catch (error) {
    console.error("Error in getDownloadCount action:", error);
    return { success: false, downloadCount: 0 };
  }
}

export async function incrementDownloadCount(slug: string) {
  try {
    if (!validateSlug(slug)) {
      return { success: false, error: "잘못된 페이지 식별자입니다." };
    }
    const newCount = await incrementPostDownloadCount(slug);
    revalidatePath(`/ko/blog/${slug}`); // 해당 경로의 캐시를 무효화
    return { success: true, downloadCount: newCount };
  } catch (error) {
    console.error("Error in incrementDownloadCount action:", error);
    return { success: false, error: "Failed to increment download count" };
  }
}
