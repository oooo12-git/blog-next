-- 통합 포스트 통계 테이블 (조회수 + 좋아요 통합)
CREATE TABLE IF NOT EXISTS post_stats (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  last_liked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 사용자 활동 추적 테이블 (좋아요 상태만 추적, 조회수는 세션별 추적 불필요)
CREATE TABLE IF NOT EXISTS user_activities (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  user_session VARCHAR(255) NOT NULL,
  has_liked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(slug, user_session)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_stats_slug ON post_stats(slug);
CREATE INDEX IF NOT EXISTS idx_post_stats_view_count ON post_stats(view_count);
CREATE INDEX IF NOT EXISTS idx_post_stats_like_count ON post_stats(like_count);
CREATE INDEX IF NOT EXISTS idx_user_activities_slug ON user_activities(slug);
CREATE INDEX IF NOT EXISTS idx_user_activities_session ON user_activities(user_session);

-- RLS 정책 설정
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- post_stats 테이블 정책
CREATE POLICY "Allow public read access on post_stats" ON post_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on post_stats" ON post_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on post_stats" ON post_stats
    FOR UPDATE USING (true);

-- user_activities 테이블 정책
CREATE POLICY "Allow public read access on user_activities" ON user_activities
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on user_activities" ON user_activities
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on user_activities" ON user_activities
    FOR UPDATE USING (true);

-- 좋아요 수 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_like_count_unified()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- post_stats의 like_count 업데이트
        UPDATE post_stats 
        SET like_count = (
            SELECT COUNT(*) 
            FROM user_activities 
            WHERE slug = NEW.slug AND has_liked = true
        ),
        last_liked_at = CASE 
            WHEN NEW.has_liked THEN NOW() 
            ELSE last_liked_at 
        END,
        updated_at = NOW()
        WHERE slug = NEW.slug;
        
        -- post_stats에 레코드가 없으면 생성
        INSERT INTO post_stats (slug, like_count, last_liked_at, updated_at)
        SELECT NEW.slug, 
               (SELECT COUNT(*) FROM user_activities WHERE slug = NEW.slug AND has_liked = true),
               CASE WHEN NEW.has_liked THEN NOW() ELSE NULL END,
               NOW()
        WHERE NOT EXISTS (SELECT 1 FROM post_stats WHERE slug = NEW.slug);
        
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- 삭제 시 좋아요 수 업데이트
        UPDATE post_stats 
        SET like_count = (
            SELECT COUNT(*) 
            FROM user_activities 
            WHERE slug = OLD.slug AND has_liked = true
        ),
        updated_at = NOW()
        WHERE slug = OLD.slug;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_like_count_unified
    AFTER INSERT OR UPDATE OR DELETE ON user_activities
    FOR EACH ROW EXECUTE FUNCTION update_like_count_unified();

-- 편의를 위한 뷰 생성
CREATE OR REPLACE VIEW post_analytics AS
SELECT 
    ps.slug,
    ps.view_count,
    ps.like_count,
    ps.last_viewed_at,
    ps.last_liked_at,
    ps.created_at,
    ps.updated_at,
    -- 참여도 계산 (좋아요/조회수 비율)
    CASE 
        WHEN ps.view_count > 0 THEN 
            ROUND((ps.like_count::DECIMAL / ps.view_count) * 100, 2) 
        ELSE 0 
    END as engagement_rate
FROM post_stats ps;

-- 테이블 생성 완료 확인
SELECT 'post_stats 통합 테이블이 성공적으로 생성되었습니다.' as message; 