"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { Comment, CommentFormData } from "@/lib/types";
import CommentForm from "./CommentForm";

const inter = Inter({ subsets: ["latin"] });

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, data: CommentFormData) => void;
  onEdit: (commentId: string, email: string, data: CommentFormData) => void;
  onDelete: (commentId: string, email: string) => void;
  depth?: number; // 답글 깊이 (인덴트용)
}

/**
 * 개별 댓글 컴포넌트
 * 댓글 표시, 답글/수정/삭제 기능, 중첩 답글 지원
 */
export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<"edit" | "delete" | null>(
    null
  );
  const [authEmail, setAuthEmail] = useState("");

  // 답글 제출 핸들러
  const handleReplySubmit = (data: CommentFormData) => {
    onReply(comment.id, data);
    setShowReplyForm(false);
  };

  // 수정 제출 핸들러
  const handleEditSubmit = (data: CommentFormData) => {
    onEdit(comment.id, comment.email, data);
    setShowEditForm(false);
  };

  // 이메일 인증 핸들러
  const handleAuth = (action: "edit" | "delete") => {
    if (!authEmail.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (authEmail !== comment.email) {
      alert("이메일이 일치하지 않습니다.");
      return;
    }

    setShowAuthModal(null);
    setAuthEmail("");

    if (action === "edit") {
      setShowEditForm(true);
    } else if (action === "delete") {
      if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        onDelete(comment.id, authEmail);
      }
    }
  };

  // 날짜 포매팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 답글 인덴트 스타일 (Tailwind 동적 클래스 문제 해결)
  const getIndentStyle = (depth: number) => {
    if (depth === 0) return {};
    const indentValue = Math.min(depth * 32, 128); // 32px씩 증가, 최대 128px
    return { marginLeft: `${indentValue}px` };
  };

  return (
    <div className={`${inter.className}`} style={getIndentStyle(depth)}>
      <div className="py-4">
        {/* 댓글 헤더 */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-semibold text-[#333] dark:text-neutral-200 text-sm">
              {comment.isDeleted ? "삭제된 사용자" : comment.author}
            </span>
            <div className="text-xs text-[#706E6E] dark:text-gray-400 font-light tabular-nums">
              <span>처음 쓰여진 날: {formatDate(comment.createdAt)}</span>
              {comment.lastModifiedAt && !comment.isDeleted && (
                <span className="ml-2">
                  마지막으로 고쳐진 날: {formatDate(comment.lastModifiedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 댓글 내용 또는 수정 폼 */}
        {showEditForm ? (
          <div className="mb-4">
            <CommentForm
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditForm(false)}
              initialData={{
                author: comment.author || "",
                email: comment.email,
                content: comment.content || "",
              }}
              isEdit={true}
              submitLabel="수정"
            />
          </div>
        ) : (
          <div className="mb-3">
            {comment.isDeleted ? (
              <p className="text-[#706E6E] dark:text-gray-400 italic font-light text-sm">
                삭제된 댓글입니다.
              </p>
            ) : (
              <p className="text-[#333] dark:text-neutral-100 whitespace-pre-wrap font-light text-sm">
                {comment.content}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        {!showEditForm && (
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-[#706E6E] hover:text-[#5A5858] dark:text-neutral-400 dark:hover:text-neutral-300 font-light"
            >
              답글
            </button>
            {!comment.isDeleted && (
              <>
                <button
                  onClick={() => setShowAuthModal("edit")}
                  className="text-[#706E6E] hover:text-[#5A5858] dark:text-neutral-400 dark:hover:text-neutral-300 font-light"
                >
                  수정
                </button>
                <button
                  onClick={() => setShowAuthModal("delete")}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-light"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}

        {/* 답글 작성 폼 */}
        {showReplyForm && (
          <div className="mt-4 pl-4 border-l-2 border-[#706E6E] dark:border-neutral-400">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              isReply={true}
            />
          </div>
        )}

        {/* 답글 목록 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* 이메일 인증 모달 */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-md shadow-lg max-w-md w-full mx-4 border-[0.5px] border-gray-200 dark:border-neutral-400">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#333] dark:text-neutral-200">
              {showAuthModal === "edit" ? "댓글 수정" : "댓글 삭제"}
            </h3>
            <p className="text-[#706E6E] dark:text-neutral-300 mb-4 text-sm font-light">
              본인 확인을 위해 댓글 작성 시 사용한 이메일을 입력해주세요.
            </p>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full px-3 py-2 border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#706E6E] dark:bg-gray-700 dark:text-white mb-4 text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAuth(showAuthModal);
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAuthModal(null);
                  setAuthEmail("");
                }}
                className="px-4 py-2 text-[#706E6E] border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-gray-700 text-sm font-light"
              >
                취소
              </button>
              <button
                onClick={() => handleAuth(showAuthModal)}
                className="px-4 py-2 bg-[#706E6E] text-white rounded-md hover:bg-[#5A5858] text-sm font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
