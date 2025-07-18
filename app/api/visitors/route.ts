// route.ts란?
// Next.js의 App Router에서 API 엔드포인트를 정의하는 파일
// HTTP 메서드(GET, POST, PUT, DELETE 등)에 대한 핸들러 함수를 export
// 서버 사이드에서만 실행되는 코드

// Next.js의 API 응답을 위한 유틸리티 import
import { NextResponse } from "next/server";
// Supabase 클라이언트 import
import { supabase } from "@/lib/supabase";

// GET 요청 처리 함수 - 방문자 수 조회
export async function GET() {
  try {
    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const today = new Date().toISOString().split("T")[0];

    // 오늘 날짜의 방문자 수를 데이터베이스에서 조회
    const { data: todayVisitors, error: todayError } = await supabase
      .from("visitors")
      .select("count")
      .eq("date", today)
      .single();

    // 전체 방문자 수를 조회 (모든 날짜의 방문자 수 합산)
    const { data: allVisitors, error: totalError } = await supabase
      .from("visitors")
      .select("count");
    // Supabase 쿼리의 결과 {data:[...], error: null(에러 없는 경우)}
    // 구조분해할당 { data: allVisitors, error: totalError }: data 속성의 값을 allVisitors라는 변수에 할당, error 속성의 값을 totalError라는 변수에 할당

    // 모든 날짜의 방문자 수를 합산
    const totalCount =
      allVisitors?.reduce((sum, row) => sum + (row.count || 0), 0) || 0;
    // 배열의 reduce 메서드: 배열의 모든 요소를 하나의 값으로 축약
    // sum: 누적값 (현재까지의 합계), row: 현재 처리 중인 배열 요소 (각 날짜의 방문자 데이터)
    // (row.count || 0) : row.count가 null, undefined, 0인 경우 0을 사용
    // || 0(마지막) : reduce 전체가 실패하면 (allVisitors가 없으면) 0을 반환

    // 에러 발생 시 예외 처리
    if (todayError || totalError) {
      throw new Error("Failed to fetch visitor count");
    }

    // 조회된 데이터를 JSON 형태로 반환
    return NextResponse.json({
      today: todayVisitors?.count || 0, // 오늘 방문자 수 (없으면 0)
      total: totalCount, // 전체 방문자 수 (모든 날짜 합산)
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST 요청 처리 함수 - 방문자 수 증가
export async function POST() {
  try {
    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const today = new Date().toISOString().split("T")[0];

    // RPC(Remote Procedure Call)를 사용하여 데이터베이스 함수 호출
    // rpc는 Supabase에서 저장 프로시저(stored procedure)를 호출하는 메서드
    // 장점:
    // 1. 복잡한 데이터베이스 작업을 서버 사이드에서 처리
    // 2. 트랜잭션 처리가 안전함
    // 3. 여러 쿼리를 하나의 함수로 묶어서 실행 가능
    const { error } = await supabase.rpc("increment_visitor_count", {
      visit_date: today, // 함수에 전달할 매개변수
    });
    // increment_visitor_count 함수는 데이터베이스에서 정의된 함수로, Supabase 대시보드의 "Database" > "Functions" 탭에서 확인가능

    // 에러 발생 시 예외 처리
    if (error) {
      throw new Error("Failed to update visitor count");
    }

    // 성공 응답 반환
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
