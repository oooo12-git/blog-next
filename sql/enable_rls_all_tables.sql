-- RLS 미설정 테이블에 Row Level Security 활성화
-- Supabase Security Advisor 경고 해결용 마이그레이션
-- 실행: Supabase Dashboard > SQL Editor에서 실행

-- ============================================================
-- 1. visitors 테이블 RLS 활성화
-- ============================================================
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on visitors" ON visitors
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on visitors" ON visitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on visitors" ON visitors
    FOR UPDATE USING (true);

-- ============================================================
-- 2. post_downloads 테이블 RLS 활성화
-- ============================================================
ALTER TABLE post_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on post_downloads" ON post_downloads
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on post_downloads" ON post_downloads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on post_downloads" ON post_downloads
    FOR UPDATE USING (true);

-- ============================================================
-- 확인
-- ============================================================
SELECT 'RLS가 visitors, post_downloads 테이블에 성공적으로 활성화되었습니다.' as message;
