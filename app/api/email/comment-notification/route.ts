import { NextRequest, NextResponse } from 'next/server';
import { sendCommentNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { commentContent, commentAuthor, postSlug, postTitle, pageUrl } = body;
    
    // 필수 필드 검증
    if (!commentContent || !commentAuthor || !postSlug || !pageUrl) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 이메일 발송
    const result = await sendCommentNotification({
      commentContent,
      commentAuthor,
      postSlug,
      postTitle,
      pageUrl,
    });
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('댓글 알림 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}