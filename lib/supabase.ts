// Supabase 클라이언트 라이브러리 import
import { createClient } from "@supabase/supabase-js";

// 환경 변수에서 Supabase URL과 익명 키를 가져옴
// 서버 사이드에서만 사용되므로 NEXT_PUBLIC_ 접두사 불필요 (클라이언트 노출 방지)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

// Supabase 클라이언트 인스턴스 생성 및 export
// 이 인스턴스를 통해 데이터베이스와 상호작용
export const supabase = createClient(supabaseUrl, supabaseKey);
