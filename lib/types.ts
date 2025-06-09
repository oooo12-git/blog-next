// 댓글 타입 정의
export interface Comment {
  id: string;
  author: string | null; // 삭제된 댓글의 경우 null
  email: string;
  content: string | null; // 삭제된 댓글의 경우 null
  createdAt: string;
  lastModifiedAt?: string;
  parentId?: string; // 답글의 경우 부모 댓글 ID
  replies?: Comment[]; // 중첩 답글들
  isDeleted?: boolean; // 삭제된 댓글인지 확인용 (계산된 속성)
}

export interface CommentFormData {
  author: string;
  email: string;
  content: string;
}
