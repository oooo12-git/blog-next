-- 조회수 관리를 위한 post_views 테이블 생성
CREATE TABLE IF NOT EXISTS post_views (
  id BIGSERIAL PRIMARY KEY, -- BIGSERIAL = 데이터 타입, 자동으로 증가하는(INSERT 시 자동으로 값이 할당되는) 큰 정수(SERIAL에 비해 많은 범위)
  slug VARCHAR(255) NOT NULL UNIQUE,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- slug에 대한 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_post_views_slug ON post_views(slug);
-- | idx_post_views_slug | 인덱스 이름 (관례: idx_테이블명_컬럼명) |
-- | ON post_views(slug) | post_views 테이블의 slug 컬럼에 인덱스 생성 |

-- RLS (Row Level Security 행 수준 접근 보안) 정책 설정
-- **정책(Policy)**에 따라 접근 제어
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
-- Supabase는 기본적으로 RLS 없으면 접근 차단

-- **정책(Policy)**
-- 모든 사용자가 조회할 수 있도록 허용
-- "모든 사용자" = 우리 블로그를 방문하는 모든 사람들
-- 누군가 우리 블로그에서 F12 → Network 탭 → API 요청 확인
-- Supabase URL과 anon key를 볼 수 있음 😰
-- 하지만, next js 서버 액션을 통해 supabase api키 확인 불가능하므로 괜찮음
-- 서버 액션에 대해 알아보자.
CREATE POLICY "Allow public read access" ON post_views
    FOR SELECT USING (true);

-- 모든 사용자가 삽입할 수 있도록 허용
CREATE POLICY "Allow public insert access" ON post_views
    FOR INSERT WITH CHECK (true);

-- 모든 사용자가 업데이트할 수 있도록 허용
CREATE POLICY "Allow public update access" ON post_views
    FOR UPDATE USING (true);

-- 테이블 생성 완료 확인
SELECT 'post_views 테이블이 성공적으로 생성되었습니다.' as message; 