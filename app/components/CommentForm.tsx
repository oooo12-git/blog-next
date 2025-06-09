"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { CommentFormData } from "@/lib/types";

const inter = Inter({ subsets: ["latin"] });

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<CommentFormData>;
  isReply?: boolean;
  isEdit?: boolean;
  submitLabel?: string;
}

/**
 * 댓글 작성 폼 컴포넌트
 * 새 댓글, 답글, 수정 모드에서 사용됩니다.
 */
export default function CommentForm({
  onSubmit,
  onCancel,
  initialData = {},
  isReply = false,
  isEdit = false,
  submitLabel = "등록",
}: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    author: initialData.author || "",
    email: initialData.email || "",
    content: initialData.content || "",
  });

  const [showTooltip, setShowTooltip] = useState(false);

  // 폼 데이터 업데이트 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.author.trim() ||
      !formData.email.trim() ||
      !formData.content.trim()
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    onSubmit(formData);
    if (!isEdit) {
      // 수정 모드가 아닐 때만 폼 초기화
      setFormData({ author: "", email: "", content: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${inter.className}`}>
      {/* 답글인 경우 구분선 표시 */}
      {isReply && (
        <div className="pl-1">
          <h4 className="text-sm font-medium text-[#333] dark:text-neutral-300 mb-2">
            답글 작성
          </h4>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {/* 글쓴이 입력 필드 */}
        <div className="flex-1">
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="글쓴이"
            className="w-full px-3 py-2 border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#706E6E] dark:bg-gray-700 dark:text-white text-sm"
            required
          />
        </div>

        {/* 이메일 입력 필드 (안내 툴팁 포함) */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              className="w-full px-3 py-2 border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#706E6E] dark:bg-gray-700 dark:text-white text-sm"
              required
            />
            {/* 이메일 안내 툴팁 */}
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="w-5 h-5 rounded-full bg-[#706E6E] text-white flex items-center justify-center text-xs cursor-help hover:bg-[#5A5858]">
                !
              </div>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                  이메일은 답글 알림 및 수정,삭제를 위해 사용됩니다.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 내용 입력 필드 */}
      <div>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="여기에 댓글을 작성해주세요"
          rows={4}
          className="w-full px-3 py-2 border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#706E6E] resize-none dark:bg-gray-700 dark:text-white text-sm"
          required
        />
      </div>

      {/* 버튼들 */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[#706E6E] border-[0.5px] border-gray-200 dark:border-neutral-400 rounded-md hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-gray-700 text-sm font-light"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-[#706E6E] text-white rounded-md hover:bg-[#5A5858] transition-colors text-sm font-medium"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
