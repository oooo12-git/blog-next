-- 댓글 관리를 위한 comments 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL, -- 블로그 포스트 슬러그
  author VARCHAR(100), -- 댓글 작성자 이름 (삭제된 댓글의 경우 NULL)
  email VARCHAR(255) NOT NULL, -- 댓글 작성자 이메일 (수정/삭제 시 인증용)
  content TEXT, -- 댓글 내용 (삭제된 댓글의 경우 NULL)
  parent_id UUID REFERENCES comments(id), -- 답글의 경우 부모 댓글 ID (CASCADE 제거로 답글 보호)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- updated_at 자동 업데이트를 위한 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거 생성
CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 댓글을 조회할 수 있도록 허용
CREATE POLICY "Allow public read access" ON comments
    FOR SELECT USING (true);

-- 모든 사용자가 댓글을 작성할 수 있도록 허용
CREATE POLICY "Allow public insert access" ON comments
    FOR INSERT WITH CHECK (true);

-- 모든 사용자가 댓글을 수정할 수 있도록 허용 (이메일 인증은 애플리케이션 레벨에서 처리)
CREATE POLICY "Allow public update access" ON comments
    FOR UPDATE USING (true);

-- 모든 사용자가 댓글을 삭제할 수 있도록 허용 (이메일 인증은 애플리케이션 레벨에서 처리)
CREATE POLICY "Allow public delete access" ON comments
    FOR DELETE USING (true);

-- 테이블 생성 완료 확인
SELECT 'comments 테이블이 성공적으로 생성되었습니다.' as message; 