-- 통합 포스트 통계 관리 (조회수 + 좋아요)
-- 기존 post_views 테이블에 like_count 컬럼 추가하여 통합 관리

-- 1. 기존 post_views 테이블 확장 (좋아요 컬럼 추가)
ALTER TABLE post_views 
ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_liked_at TIMESTAMP WITH TIME ZONE;

-- 2. 사용자별 좋아요 상태 관리 테이블 생성
-- 중복 좋아요 방지를 위해 사용자 세션별로 관리
CREATE TABLE IF NOT EXISTS user_likes (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL,
  user_session VARCHAR(255) NOT NULL, -- 세션 ID (IP + User-Agent 해시)
  liked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(slug, user_session) -- 같은 포스트에 대해 같은 사용자가 중복 좋아요 방지
);

-- 3. 인덱스 생성 (검색 성능 향상)
-- post_views 테이블 인덱스 (기존에 있는 것 + 새로 추가)
CREATE INDEX IF NOT EXISTS idx_post_views_like_count ON post_views(like_count);

-- user_likes 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_user_likes_slug ON user_likes(slug);
CREATE INDEX IF NOT EXISTS idx_user_likes_session ON user_likes(user_session);
CREATE INDEX IF NOT EXISTS idx_user_likes_slug_session ON user_likes(slug, user_session);

-- 4. RLS (Row Level Security) 정책 설정
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- user_likes 테이블 정책
CREATE POLICY "Allow public read access on user_likes" ON user_likes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on user_likes" ON user_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on user_likes" ON user_likes
    FOR UPDATE USING (true);

-- 5. 좋아요 수 자동 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_post_like_count_unified()
RETURNS TRIGGER AS $$
BEGIN
    -- user_likes 테이블에서 변경이 발생했을 때 post_views의 like_count 업데이트
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- 해당 포스트의 좋아요 수 계산 및 업데이트
        UPDATE post_views 
        SET like_count = (
            SELECT COUNT(*) 
            FROM user_likes 
            WHERE slug = NEW.slug AND liked = true
        ),
        last_liked_at = CASE 
            WHEN NEW.liked THEN NOW() 
            ELSE last_liked_at 
        END
        WHERE slug = NEW.slug;
        
        -- post_views에 레코드가 없으면 생성 (조회수는 0으로 시작)
        INSERT INTO post_views (slug, view_count, like_count, last_liked_at, last_viewed_at)
        SELECT NEW.slug, 
               0, -- 초기 조회수
               (SELECT COUNT(*) FROM user_likes WHERE slug = NEW.slug AND liked = true),
               CASE WHEN NEW.liked THEN NOW() ELSE NULL END,
               NOW()
        WHERE NOT EXISTS (SELECT 1 FROM post_views WHERE slug = NEW.slug);
        
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- 삭제 시 좋아요 수 업데이트
        UPDATE post_views 
        SET like_count = (
            SELECT COUNT(*) 
            FROM user_likes 
            WHERE slug = OLD.slug AND liked = true
        )
        WHERE slug = OLD.slug;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 6. 트리거 생성
CREATE TRIGGER trigger_update_post_like_count_unified
    AFTER INSERT OR UPDATE OR DELETE ON user_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count_unified();

-- 7. 분석을 위한 뷰 생성
CREATE OR REPLACE VIEW post_analytics AS
SELECT 
    slug,
    view_count,
    like_count,
    last_viewed_at,
    last_liked_at,
    -- 참여도 계산 (좋아요/조회수 비율)
    CASE 
        WHEN view_count > 0 THEN 
            ROUND((like_count::DECIMAL / view_count) * 100, 2) 
        ELSE 0 
    END as engagement_rate,
    -- 인기도 점수 (조회수 * 0.7 + 좋아요 * 0.3)
    ROUND((view_count * 0.7 + like_count * 0.3), 2) as popularity_score
FROM post_views;

-- 테이블 생성 및 수정 완료 확인
SELECT 'post_views 테이블 확장 및 user_likes 테이블이 성공적으로 생성되었습니다. 조회수와 좋아요가 통합 관리됩니다.' as message; 