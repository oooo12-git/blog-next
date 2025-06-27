import { google } from "googleapis";
const { JWT } = require("google-auth-library");

interface EmailNotificationData {
  commentContent: string;
  commentAuthor: string;
  postSlug: string;
  postTitle?: string;
  pageUrl: string;
}

interface ReplyNotificationData {
  replyContent: string;
  replyAuthor: string;
  originalCommentContent: string;
  originalCommentAuthor: string;
  originalCommentEmail: string;
  postSlug: string;
  postTitle?: string;
  pageUrl: string;
}

// JWT 인증을 위한 서비스 계정 클라이언트 생성
const createServiceAccountAuth = () => {
  try {
    const rawEnvValue = process.env.GMAIL_SERVICE_ACCOUNT;

    console.log("GMAIL_SERVICE_ACCOUNT 환경변수 존재 여부:", !!rawEnvValue);
    console.log("GMAIL_SERVICE_ACCOUNT 길이:", rawEnvValue?.length || 0);

    if (!rawEnvValue) {
      throw new Error("GMAIL_SERVICE_ACCOUNT 환경변수가 설정되지 않았습니다.");
    }

    let serviceAccount;

    // Base64 인코딩된 경우인지 확인 (JSON이 { 로 시작하지 않으면 Base64로 간주)
    if (!rawEnvValue.trim().startsWith("{")) {
      console.log("Base64 디코딩 시도 중...");
      try {
        const decoded = Buffer.from(rawEnvValue, "base64").toString("utf-8");
        serviceAccount = JSON.parse(decoded);
        console.log("Base64 디코딩 성공");
      } catch (base64Error) {
        console.error("Base64 디코딩 실패:", base64Error);
        throw new Error("Base64 디코딩에 실패했습니다.");
      }
    } else {
      // 직접 JSON 파싱
      console.log("직접 JSON 파싱 시도 중...");
      serviceAccount = JSON.parse(rawEnvValue);
    }

    // 필수 필드 확인
    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error(
        "서비스 계정 JSON에 필수 필드(client_email, private_key)가 누락되었습니다."
      );
    }

    console.log("서비스 계정 이메일:", serviceAccount.client_email);

    return new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
      subject: "kimjaahyun@kimjaahyun.com",
    });
  } catch (error) {
    console.error("서비스 계정 파싱 오류:", error);
    throw new Error("GMAIL_SERVICE_ACCOUNT 환경변수가 올바르지 않습니다.");
  }
};

// Subject를 MIME 인코딩하는 함수
const encodeSubject = (subject: string): string => {
  // UTF-8로 인코딩된 Base64 문자열 생성
  const encoded = Buffer.from(subject, "utf-8").toString("base64");
  // MIME 인코딩 형식으로 반환
  return `=?UTF-8?B?${encoded}?=`;
};

// 이메일 메시지 생성 (RFC 2822 형식) - 새 댓글 알림
const createEmailMessage = (
  data: EmailNotificationData,
  serviceAccountEmail: string
): string => {
  const subject = `[블로그 댓글] ${
    data.postTitle || data.postSlug
  }에 새 댓글이 등록되었습니다`;

  // Subject를 MIME 인코딩
  const encodedSubject = encodeSubject(subject);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #706E6E; padding-bottom: 10px;">
          새로운 댓글이 등록되었습니다
        </h2>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 10px 0; color: #555;">
            <strong>작성자:</strong> ${data.commentAuthor}
          </p>
          <p style="margin: 10px 0; color: #555;">
            <strong>페이지:</strong> ${data.postTitle || data.postSlug}
          </p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">댓글 내용:</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${
            data.commentContent
          }</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${data.pageUrl}" 
             style="display: inline-block; background-color: #706E6E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            댓글 확인하기
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; text-align: center;">
          이 메일은 kimjaahyun.com 블로그에서 자동으로 발송되었습니다.
        </div>
      </div>
    </div>
  `;

  // RFC 2822 형식의 이메일 메시지 구성 - 인코딩된 Subject 사용
  const message = [
    `From: "Blog Admin" <admin@kimjaahyun.com>`,
    `To: kimjaahyun@kimjaahyun.com`,
    `Subject: ${encodedSubject}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlContent,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
};

// 답글 알림 이메일 메시지 생성 (RFC 2822 형식)
const createReplyEmailMessage = (
  data: ReplyNotificationData,
  serviceAccountEmail: string
): string => {
  const subject = `[블로그 답글] ${
    data.postTitle || data.postSlug
  }에 작성하신 댓글에 답글이 달렸습니다`;

  // Subject를 MIME 인코딩
  const encodedSubject = encodeSubject(subject);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #706E6E; padding-bottom: 10px;">
          작성하신 댓글에 답글이 달렸습니다
        </h2>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 10px 0; color: #555;">
            <strong>페이지:</strong> ${data.postTitle || data.postSlug}
          </p>
          <p style="margin: 10px 0; color: #555;">
            <strong>답글 작성자:</strong> ${data.replyAuthor}
          </p>
        </div>
        
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3;">
          <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">원 댓글:</h4>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap; margin: 0;">${
            data.originalCommentContent
          }</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">답글 내용:</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${
            data.replyContent
          }</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="${data.pageUrl}" 
             style="display: inline-block; background-color: #706E6E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            답글 확인하기
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px; text-align: center;">
          이 메일은 kimjaahyun.com 블로그에서 자동으로 발송되었습니다.
        </div>
      </div>
    </div>
  `;

  // RFC 2822 형식의 이메일 메시지 구성 - 인코딩된 Subject 사용
  const message = [
    `From: "Blog Admin" <admin@kimjaahyun.com>`,
    `To: ${data.originalCommentEmail}`,
    `Subject: ${encodedSubject}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    htmlContent,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
};

// Gmail API를 사용한 이메일 발송
export async function sendCommentNotification(
  data: EmailNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    // 서비스 계정 인증
    const auth = createServiceAccountAuth();
    await auth.authorize();

    // 서비스 계정 이메일 가져오기
    const serviceAccountEmail = auth.email || "";
    console.log("발신 이메일:", serviceAccountEmail);

    // Gmail API 클라이언트 생성
    const gmail = google.gmail({ version: "v1", auth });

    // 이메일 메시지 생성
    const rawMessage = createEmailMessage(data, serviceAccountEmail);

    // 이메일 전송
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("이메일 발송 성공:", response.data.id);
    return { success: true };
  } catch (error) {
    console.error("Gmail API 이메일 발송 실패:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Gmail API를 사용한 답글 알림 이메일 발송
export async function sendReplyNotification(
  data: ReplyNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    // 서비스 계정 인증
    const auth = createServiceAccountAuth();
    await auth.authorize();

    // 서비스 계정 이메일 가져오기
    const serviceAccountEmail = auth.email || "";
    console.log("발신 이메일:", serviceAccountEmail);
    console.log("수신 이메일:", data.originalCommentEmail);

    // Gmail API 클라이언트 생성
    const gmail = google.gmail({ version: "v1", auth });

    // 답글 알림 이메일 메시지 생성
    const rawMessage = createReplyEmailMessage(data, serviceAccountEmail);

    // 이메일 전송
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("답글 알림 이메일 발송 성공:", response.data.id);
    return { success: true };
  } catch (error) {
    console.error("Gmail API 답글 알림 이메일 발송 실패:", error);

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
