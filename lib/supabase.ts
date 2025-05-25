// Supabase 클라이언트 라이브러리 import
import { createClient } from "@supabase/supabase-js";

// 환경 변수에서 Supabase URL과 익명 키를 가져옴
// ! 연산자는 TypeScript에게 이 값들이 반드시 존재한다고 알려줌
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // process : Node.js 애플리케이션이 실행될 때 자동으로 생성되는 전역 객체
// 프로세스의 정보를 조회하고 제어할 수 있는 다양한 속성과 메서드를 제공
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트 인스턴스 생성 및 export
// 이 인스턴스를 통해 데이터베이스와 상호작용
export const supabase = createClient(supabaseUrl, supabaseKey);
