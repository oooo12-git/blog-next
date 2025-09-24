"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Comment, CommentFormData } from "@/lib/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import {
  getComments,
  createComment,
  editComment,
  removeComment,
} from "@/lib/actions";
import { useTranslations } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

interface CommentSectionProps {
  slug: string; // 블로그 포스트 식별자
  locale: string; // 언어/지역 코드
}

/**
 * 댓글 시스템 메인 컴포넌트
 * 댓글 목록 관리, 새 댓글 작성, 답글/수정/삭제 기능 통합
 */
export default function CommentSection({ slug, locale }: CommentSectionProps) {
  const t = useTranslations("comment");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 댓글 로드
  useEffect(() => {
    loadComments();
  }, [slug]);

  // 댓글 로드 함수 (Supabase에서 실제 데이터 로드)
  const loadComments = async () => {
    try {
      const result = await getComments(slug);
      if (result.success) {
        setComments(result.comments);
      } else {
        console.error("댓글 로드 실패:", result.error);
        setComments([]);
      }
    } catch (error) {
      console.error("댓글 로드 실패:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // 새 댓글 추가 함수 (낙관적 업데이트)
  const handleAddComment = async (data: CommentFormData) => {
    // 1. 임시 댓글 생성
    const tempId = `temp_${Date.now()}`;
    const tempComment: Comment = {
      id: tempId,
      content: data.content,
      author: data.author,
      email: data.email,
      createdAt: new Date().toISOString(),
      parentId: undefined,
      replies: [],
    };

    // 2. 낙관적 업데이트: 즉시 UI에 반영
    setComments((prev) => [...prev, tempComment]);

    try {
      const result = await createComment(slug, locale, data);

      if (result.success && result.comment) {
        // 3. 성공 시 임시 댓글을 실제 댓글로 교체
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === tempId
              ? { ...result.comment!, replies: [] }
              : comment
          )
        );
        alert("댓글이 등록되었습니다.");
      } else {
        // 4. 실패 시 임시 댓글 제거
        setComments((prev) => prev.filter((comment) => comment.id !== tempId));
        alert(result.error || "댓글 등록에 실패했습니다.");
      }
    } catch (error) {
      // 5. 에러 시 임시 댓글 제거
      setComments((prev) => prev.filter((comment) => comment.id !== tempId));
      console.error("댓글 추가 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 답글 추가 함수 (낙관적 업데이트)
  const handleAddReply = async (parentId: string, data: CommentFormData) => {
    // 1. 임시 답글 생성
    const tempId = `temp_${Date.now()}`;
    const tempReply: Comment = {
      id: tempId,
      content: data.content,
      author: data.author,
      email: data.email,
      createdAt: new Date().toISOString(),
      parentId: parentId,
      replies: [],
    };

    // 2. 낙관적 업데이트: 부모 댓글의 replies에 즉시 추가
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), tempReply] }
          : comment
      )
    );

    try {
      const result = await createComment(slug, locale, data, parentId);

      if (result.success && result.comment) {
        // 3. 성공 시 임시 답글을 실제 답글로 교체
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies:
                    comment.replies?.map((reply) =>
                      reply.id === tempId
                        ? { ...result.comment!, replies: [] }
                        : reply
                    ) || [],
                }
              : comment
          )
        );
        alert("답글이 등록되었습니다.");
      } else {
        // 4. 실패 시 임시 답글 제거
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies:
                    comment.replies?.filter((reply) => reply.id !== tempId) ||
                    [],
                }
              : comment
          )
        );
        alert(result.error || "답글 등록에 실패했습니다.");
      }
    } catch (error) {
      // 5. 에러 시 임시 답글 제거
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies:
                  comment.replies?.filter((reply) => reply.id !== tempId) || [],
              }
            : comment
        )
      );
      console.error("답글 추가 실패:", error);
      alert("답글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정 함수 (낙관적 업데이트)
  const handleEditComment = async (
    commentId: string,
    email: string,
    data: CommentFormData
  ) => {
    // 1. 낙관적 업데이트: 즉시 UI에 반영
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: data.content, author: data.author }
          : comment
      )
    );

    try {
      const result = await editComment(commentId, email, data, slug, locale);

      if (result.success && result.comment) {
        // 2. 성공 시 서버 결과로 동기화
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...result.comment!, replies: comment.replies || [] }
              : comment
          )
        );
        alert("댓글이 수정되었습니다.");
      } else {
        // 3. 실패 시 원래 상태로 롤백
        await loadComments();
        alert(result.error || "댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      // 4. 에러 시 원래 상태로 롤백
      await loadComments();
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 함수 (낙관적 소프트 삭제)
  const handleDeleteComment = async (commentId: string, email: string) => {
    // 1. 낙관적 소프트 삭제: 즉시 UI에 반영
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, author: null, content: null, isDeleted: true }
          : comment
      )
    );

    try {
      const result = await removeComment(commentId, email, slug, locale);

      if (result.success) {
        // 2. 성공 시 서버 결과로 동기화 (이미 소프트 삭제됨)
        alert("댓글이 삭제되었습니다.");
      } else {
        // 3. 실패 시 원래 상태로 롤백
        await loadComments();
        alert(result.error || "댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      // 4. 에러 시 원래 상태로 롤백
      await loadComments();
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className={`mt-8 mx-2 sm:mx-0 ${inter.className}`}>
        <div className="border-t border-[0.5px] border-gray-200 dark:border-neutral-400 pt-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#706E6E] dark:border-neutral-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-8 mx-2 sm:mx-0 ${inter.className}`}>
      {/* 댓글 섹션 헤더 */}
      <div className="rounded-md border-[0.5px] dark:border-neutral-400 pt-8 p-3 sm:p-4">
        <h2 className="border-b-[0.5px] border-gray-200 dark:border-neutral-400 pb-2 text-xl sm:text-2xl font-semibold text-[#333] dark:text-neutral-200 mb-2">
          {t("comment")}
        </h2>

        {/* 댓글 목록 */}
        <div className="space-y-0">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleAddReply}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))
          ) : (
            <div className="text-center py-8 text-[#706E6E] dark:text-gray-400 font-light">
              {t("noComments")}
            </div>
          )}
        </div>

        {/* 새 댓글 작성 폼 */}
        <div className="mb-8 p-3 sm:p-4 mt-2 border-[0.5px] border-gray-200 dark:border-neutral-400 bg-[#FAFAFA] dark:bg-gray-800 rounded-md">
          <h3 className="text-base sm:text-lg font-semibold text-[#333] dark:text-neutral-200 mb-4">
            {t("writeComment")}
          </h3>
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
